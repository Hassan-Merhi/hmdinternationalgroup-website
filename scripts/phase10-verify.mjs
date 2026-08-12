import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(rootDir, "dist", "public");
const assetsDir = path.join(publicDir, "assets");
const serverEntry = path.join(rootDir, "dist-server", "server", "index.js");

function check(condition, message) {
  assert.ok(condition, message);
}

async function verifyBuildAndResponsiveContract() {
  const [sourceHtml, baseCss, textileCss, phase58Css, phase9Css, builtHtml] = await Promise.all([
    readFile(path.join(rootDir, "client", "index.html"), "utf8"),
    readFile(path.join(rootDir, "client", "src", "styles.css"), "utf8"),
    readFile(path.join(rootDir, "client", "src", "textile-reposition.css"), "utf8"),
    readFile(path.join(rootDir, "client", "src", "phases5-8.css"), "utf8"),
    readFile(path.join(rootDir, "client", "src", "phase9.css"), "utf8"),
    readFile(path.join(publicDir, "index.html"), "utf8"),
  ]);

  check(sourceHtml.includes('name="viewport"'), "responsive viewport meta tag is missing");
  check(sourceHtml.includes("width=device-width"), "viewport is not device-width aware");
  check(sourceHtml.includes("viewport-fit=cover"), "safe-area viewport support is missing");
  check(sourceHtml.includes("Used Clothing"), "base metadata no longer reflects the textile business");

  const allCss = [baseCss, textileCss, phase58Css, phase9Css].join("\n");
  check(allCss.includes("@media"), "responsive media queries are missing");
  check(phase9Css.includes("prefers-reduced-motion"), "Phase 9 reduced-motion handling is missing");
  check(phase9Css.includes(".phase9-site"), "Phase 9 premium visual layer is missing");
  check(phase9Css.includes("direction: rtl") || phase9Css.includes('[dir="rtl"]'), "RTL-aware Phase 9 layout support is missing");
  check(baseCss.includes("body { margin: 0; min-width: 320px"), "minimum supported viewport contract changed");
  check(baseCss.includes("img { max-width: 100%"), "responsive image containment rule is missing");
  check(baseCss.includes(".site-shell { min-height: 100vh; overflow: clip;"), "page-shell horizontal overflow containment is missing");

  check(builtHtml.includes("/assets/"), "production HTML does not reference compiled assets");
  const assetFiles = await readdir(assetsDir);
  const jsFiles = assetFiles.filter((file) => file.endsWith(".js"));
  const cssFiles = assetFiles.filter((file) => file.endsWith(".css"));
  check(jsFiles.length >= 9, "expected route-level JavaScript code splitting is missing");
  check(cssFiles.length >= 1, "compiled CSS bundle is missing");

  const jsSizes = await Promise.all(jsFiles.map(async (file) => ({ file, size: (await stat(path.join(assetsDir, file))).size })));
  const largestJs = jsSizes.sort((a, b) => b.size - a.size)[0];
  check(largestJs && largestJs.size <= 350 * 1024, `largest JavaScript chunk is too large: ${largestJs?.file} (${largestJs?.size} bytes)`);

  console.log(`✓ Phase 10 build/responsive contract (${jsFiles.length} JS chunks; largest ${Math.round(largestJs.size / 1024)} KB)`);
}

async function waitForServer(baseUrl, child, logs) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (child.exitCode !== null) throw new Error(`production server exited early (${child.exitCode})\n${logs.join("")}`);
    try {
      const response = await fetch(`${baseUrl}/api/health`);
      if (response.ok) return;
    } catch {
      // Server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`production server did not become healthy\n${logs.join("")}`);
}

function cookieFrom(response) {
  const setCookie = response.headers.get("set-cookie") || "";
  return { setCookie, cookie: setCookie.split(";", 1)[0] };
}

async function verifyProductionServer() {
  const port = 43000 + Math.floor(Math.random() * 1000);
  const baseUrl = `http://127.0.0.1:${port}`;
  const logs = [];
  const password = "Phase10-Verification-Passphrase-2026!";
  const child = spawn(process.execPath, [serverEntry], {
    cwd: rootDir,
    env: {
      ...process.env,
      NODE_ENV: "production",
      PORT: String(port),
      SESSION_SECRET: "phase10-session-secret-0123456789abcdefghijklmnopqrstuvwxyz",
      ADMIN_USERNAME: "phase10",
      ADMIN_PASSWORD: password,
      DATABASE_URL: "",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  child.stdout.on("data", (chunk) => logs.push(chunk.toString()));
  child.stderr.on("data", (chunk) => logs.push(chunk.toString()));

  try {
    await waitForServer(baseUrl, child, logs);

    const canonicalRoutes = [
      "/",
      "/about",
      "/what-we-do",
      "/products",
      "/process",
      "/companies/hmd-international-group",
      "/export-markets",
      "/sustainability",
      "/gallery",
      "/contact",
      "/admin",
    ];

    for (const route of canonicalRoutes) {
      const response = await fetch(`${baseUrl}${route}`, { redirect: "manual" });
      assert.equal(response.status, 200, `${route} should return HTTP 200 directly`);
      const body = await response.text();
      check(body.includes('<div id="root"></div>'), `${route} did not return the application shell`);
    }

    const rootResponse = await fetch(`${baseUrl}/`);
    check((rootResponse.headers.get("content-security-policy") || "").includes("default-src 'self'"), "CSP header is missing");
    assert.equal(rootResponse.headers.get("x-content-type-options"), "nosniff", "nosniff header is missing");
    assert.equal(rootResponse.headers.get("x-frame-options"), "DENY", "clickjacking protection is missing");
    assert.equal(rootResponse.headers.get("cross-origin-opener-policy"), "same-origin", "COOP header is missing");
    assert.equal(rootResponse.headers.get("cross-origin-resource-policy"), "same-origin", "CORP header is missing");
    check((rootResponse.headers.get("strict-transport-security") || "").includes("max-age=31536000"), "HSTS header is missing in production");
    assert.equal(rootResponse.headers.get("x-powered-by"), null, "Express fingerprint header should be disabled");

    const adminHtml = await fetch(`${baseUrl}/admin`);
    assert.equal(adminHtml.headers.get("x-robots-tag"), "noindex, nofollow", "admin route should be excluded from indexing");

    const missing = await fetch(`${baseUrl}/this-route-must-not-exist`, { redirect: "manual" });
    assert.equal(missing.status, 404, "unknown public route should return HTTP 404");

    const legacyRedirects = new Map([
      ["/businesses", "/what-we-do"],
      ["/industries", "/products"],
      ["/global-reach", "/export-markets"],
      ["/hmd", "/companies/hmd-international-group"],
      ["/companies", "/companies/hmd-international-group"],
      ["/about/story", "/about"],
      ["/about/vision", "/about"],
    ]);
    for (const [from, to] of legacyRedirects) {
      const response = await fetch(`${baseUrl}${from}`, { redirect: "manual" });
      assert.equal(response.status, 301, `${from} should permanently redirect`);
      assert.equal(response.headers.get("location"), to, `${from} redirect target is incorrect`);
    }

    const sitemap = await fetch(`${baseUrl}/sitemap.xml`);
    assert.equal(sitemap.status, 200, "sitemap should return HTTP 200");
    check((sitemap.headers.get("content-type") || "").includes("application/xml"), "sitemap content type is incorrect");
    const sitemapBody = await sitemap.text();
    for (const route of canonicalRoutes.filter((route) => route !== "/admin")) {
      check(sitemapBody.includes(`https://samwatex.com${route}`), `${route} is missing from sitemap`);
    }
    for (const legacy of ["/industries", "/global-reach", "/about/story", "/about/vision", "/companies"]) {
      check(!sitemapBody.includes(`<loc>https://samwatex.com${legacy}</loc>`), `${legacy} should not be published in sitemap`);
    }

    const siteContentResponse = await fetch(`${baseUrl}/api/site-content`);
    assert.equal(siteContentResponse.status, 200, "public site content endpoint should be available");
    const siteContent = await siteContentResponse.json();
    check(siteContent.brandName === "SAMWATEX", "site content brand is incorrect");
    check(String(siteContent.heroTitle || "").toLowerCase().includes("used clothing"), "site content still exposes the old generic trade positioning");
    check(Array.isArray(siteContent.industries) && siteContent.industries.length >= 6, "textile product catalogue is incomplete");
    check(Array.isArray(siteContent.companies) && siteContent.companies.some((company) => company.slug === "hmd-international-group"), "HMD operating-company content is missing");

    const unauthorizedSession = await fetch(`${baseUrl}/api/admin/session`);
    assert.equal(unauthorizedSession.status, 401, "unauthenticated admin session should be rejected");
    check((unauthorizedSession.headers.get("cache-control") || "").includes("no-store"), "private admin response must not be cached");

    const badLogin = await fetch(`${baseUrl}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: "phase10", password: "incorrect-password" }),
    });
    assert.equal(badLogin.status, 401, "invalid admin credentials should be rejected");

    const login = await fetch(`${baseUrl}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Forwarded-Proto": "https" },
      body: JSON.stringify({ username: "phase10", password }),
    });
    assert.equal(login.status, 200, "valid admin credentials should authenticate");
    const loginBody = await login.json();
    check(typeof loginBody.csrfToken === "string" && loginBody.csrfToken.length >= 32, "admin login did not issue a CSRF token");
    const { setCookie, cookie } = cookieFrom(login);
    check(cookie.startsWith("samwatex.site.admin="), "admin session cookie is missing");
    check(setCookie.includes("HttpOnly"), "admin cookie must be HttpOnly");
    check(setCookie.includes("Secure"), "admin cookie must be Secure in production");
    check(setCookie.includes("SameSite=Strict"), "admin cookie must use SameSite=Strict");

    const session = await fetch(`${baseUrl}/api/admin/session`, { headers: { Cookie: cookie } });
    assert.equal(session.status, 200, "authenticated admin session should be readable");
    check((session.headers.get("cache-control") || "").includes("no-store"), "authenticated admin response must not be cached");

    const missingCsrf = await fetch(`${baseUrl}/api/admin/logout`, { method: "POST", headers: { Cookie: cookie } });
    assert.equal(missingCsrf.status, 403, "state-changing admin request without CSRF must be rejected");

    const crossSite = await fetch(`${baseUrl}/api/admin/logout`, {
      method: "POST",
      headers: { Cookie: cookie, "X-CSRF-Token": loginBody.csrfToken, Origin: "https://example.invalid" },
    });
    assert.equal(crossSite.status, 403, "cross-site admin mutation must be rejected");

    const saveContent = await fetch(`${baseUrl}/api/admin/site-content`, {
      method: "PUT",
      headers: { Cookie: cookie, "Content-Type": "application/json", "X-CSRF-Token": loginBody.csrfToken },
      body: JSON.stringify(siteContent),
    });
    assert.equal(saveContent.status, 200, "authenticated CSRF-protected CMS mutation should succeed");

    const contactPayload = {
      inquiryType: "export",
      name: "Phase 10 Verification",
      email: "phase10@example.com",
      country: "Lebanon",
      message: "Production verification enquiry used by the automated Phase 10 smoke test.",
      companyInterest: "SAMWATEX",
      productInterest: "Wholesale used clothing",
      sourcePath: "/contact",
      startedAt: Date.now() - 2000,
      website: "",
    };
    const contact = await fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactPayload),
    });
    assert.equal(contact.status, 201, "valid public enquiry should be accepted");
    const contactBody = await contact.json();
    check(typeof contactBody.reference === "string" && contactBody.reference.startsWith("SWX-"), "public enquiry reference is missing");

    const honeypot = await fetch(`${baseUrl}/api/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...contactPayload, website: "bot.example" }),
    });
    assert.equal(honeypot.status, 201, "honeypot submissions should be silently absorbed");
    const honeypotBody = await honeypot.json();
    assert.equal(honeypotBody.reference, undefined, "honeypot submission should not receive a real enquiry reference");

    const logout = await fetch(`${baseUrl}/api/admin/logout`, {
      method: "POST",
      headers: { Cookie: cookie, "X-CSRF-Token": loginBody.csrfToken },
    });
    assert.equal(logout.status, 200, "authenticated logout should succeed");

    console.log(`✓ Phase 10 production routes, redirects, SEO sitemap, security, CMS and enquiry checks (${canonicalRoutes.length} canonical routes)`);
  } finally {
    if (child.exitCode === null) child.kill("SIGTERM");
  }
}

await verifyBuildAndResponsiveContract();
await verifyProductionServer();
console.log("✓ Phase 10 verification passed");
