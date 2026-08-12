import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import compression from "compression";
import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import type { SiteContent } from "../shared/siteContent.js";
import { defaultSiteContent, normalizeSiteContent } from "../shared/siteContent.js";
import { initializeDatabase, pool } from "./db.js";
import {
  createRateLimiter,
  decodeMedia,
  fingerprintIp,
  hashPassword,
  newCsrfToken,
  passwordProblem,
  requireCsrf,
  safeEqual,
  sameOriginGuard,
  sanitizeFileName,
  securityHeaders,
  text,
  validateSiteContent,
  verifyPassword,
} from "./security.js";

const app = express();
const port = Number(process.env.PORT || 3001);
const isProduction = process.env.NODE_ENV === "production";
let memoryContent: SiteContent = structuredClone(defaultSiteContent);

if (isProduction && (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)) {
  throw new Error("SESSION_SECRET must be configured with at least 32 characters in production");
}

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(securityHeaders);
app.use(compression());

const loginIpLimit = createRateLimiter({ limit: 20, windowMs: 15 * 60_000, message: "Too many login attempts. Try again later." });
const contactIpLimit = createRateLimiter({ limit: 8, windowMs: 60 * 60_000, message: "Too many enquiries from this connection. Please try again later." });
const adminWriteLimit = createRateLimiter({ limit: 120, windowMs: 60_000, message: "Too many admin changes. Please slow down." });
app.use("/api/admin/login", loginIpLimit);
app.use("/api/contact", contactIpLimit);
app.use("/api/admin", sameOriginGuard);

const standardJson = express.json({ limit: "256kb", strict: true });
const mediaJson = express.json({ limit: "12mb", strict: true });
function isLargeMediaRequest(req: express.Request) {
  return (req.path === "/api/admin/media" && req.method === "POST")
    || (/^\/api\/admin\/media\/\d+\/content$/.test(req.path) && req.method === "PUT");
}
app.use((req, res, next) => isLargeMediaRequest(req) ? next() : standardJson(req, res, next));

const PgStore = connectPgSimple(session);
const sessionStore = pool ? new PgStore({ pool, tableName: "website_sessions", createTableIfMissing: true }) : undefined;
app.use(session({
  name: "samwatex.site.admin",
  secret: process.env.SESSION_SECRET || crypto.randomBytes(48).toString("hex"),
  resave: false,
  saveUninitialized: false,
  rolling: false,
  store: sessionStore,
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 12 * 60 * 60 * 1000,
    path: "/",
  },
}));

declare module "express-session" {
  interface SessionData {
    isWebsiteAdmin?: boolean;
    adminUserId?: number;
    adminUsername?: string;
    adminRole?: string;
    adminSessionVersion?: number;
    csrfToken?: string;
  }
}

async function writeAudit(username: string, action: string, details: Record<string, unknown> = {}) {
  if (!pool) return;
  await pool.query(
    "INSERT INTO website_admin_audit (admin_username, action, details) VALUES ($1, $2, $3::jsonb)",
    [username || "unknown", action, JSON.stringify(details)],
  );
}

async function audit(req: express.Request, action: string, details: Record<string, unknown> = {}) {
  await writeAudit(req.session.adminUsername || "admin", action, details);
}

async function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!req.session.isWebsiteAdmin) return res.status(401).json({ message: "Admin authentication required" });
  if (pool && req.session.adminUserId) {
    const result = await pool.query<{ active: boolean; role: string; session_version: number }>(
      "SELECT active, role, session_version FROM website_admins WHERE id = $1",
      [req.session.adminUserId],
    );
    const user = result.rows[0];
    if (!user || !user.active || user.session_version !== req.session.adminSessionVersion) {
      req.session.destroy(() => undefined);
      return res.status(401).json({ message: "Admin session is no longer valid. Sign in again." });
    }
    req.session.adminRole = user.role;
  }
  next();
}

function requireOwner(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (req.session.adminRole !== "owner") return res.status(403).json({ message: "Owner access is required" });
  next();
}

async function ensureBootstrapAdmin() {
  if (!pool || !process.env.ADMIN_PASSWORD) return;
  const problem = passwordProblem(process.env.ADMIN_PASSWORD);
  if (problem) throw new Error(`ADMIN_PASSWORD is not production-ready: ${problem}`);
  const username = (process.env.ADMIN_USERNAME || "admin").trim().toLowerCase();
  const existing = await pool.query("SELECT id FROM website_admins WHERE username = $1", [username]);
  if (existing.rowCount) return;
  const credentials = hashPassword(process.env.ADMIN_PASSWORD);
  await pool.query(
    `INSERT INTO website_admins (username, display_name, password_salt, password_hash, role)
     VALUES ($1, $2, $3, $4, 'owner')`,
    [username, "SAMWATEX Administrator", credentials.salt, credentials.hash],
  );
}

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character] || character);
}

const inquiryTypes = new Set(["general", "product", "export", "supplier", "partnership", "hmd"]);
const inquiryStatuses = new Set(["new", "read", "replied", "archived"]);
const failedLogins = new Map<string, { failures: number; resetAt: number; blockedUntil: number }>();
const dummyCredentials = hashPassword("samwatex-invalid-login-placeholder");

function loginKey(req: express.Request, username: string) {
  return `${fingerprintIp(req)}:${username}`;
}

function loginBlocked(key: string) {
  const entry = failedLogins.get(key);
  if (!entry) return false;
  if (entry.resetAt <= Date.now()) { failedLogins.delete(key); return false; }
  return entry.blockedUntil > Date.now();
}

function trimFailedLogins(now: number) {
  for (const [key, value] of failedLogins) {
    if (value.resetAt <= now) failedLogins.delete(key);
  }
  while (failedLogins.size >= 5000) {
    const oldestKey = failedLogins.keys().next().value as string | undefined;
    if (!oldestKey) break;
    failedLogins.delete(oldestKey);
  }
}

function recordLoginFailure(key: string) {
  const now = Date.now();
  trimFailedLogins(now);
  const current = failedLogins.get(key);
  const entry = !current || current.resetAt <= now ? { failures: 0, resetAt: now + 15 * 60_000, blockedUntil: 0 } : current;
  entry.failures += 1;
  if (entry.failures >= 5) entry.blockedUntil = now + 15 * 60_000;
  failedLogins.set(key, entry);
}

async function establishSession(req: express.Request, user: { id?: number; username: string; role: string; sessionVersion?: number }) {
  await new Promise<void>((resolve, reject) => req.session.regenerate((error) => error ? reject(error) : resolve()));
  req.session.isWebsiteAdmin = true;
  req.session.adminUserId = user.id;
  req.session.adminUsername = user.username;
  req.session.adminRole = user.role;
  req.session.adminSessionVersion = user.sessionVersion;
  req.session.csrfToken = newCsrfToken();
  await new Promise<void>((resolve, reject) => req.session.save((error) => error ? reject(error) : resolve()));
}

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/site-content", async (_req, res) => {
  res.setHeader("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
  if (!pool) return res.json(memoryContent);
  const result = await pool.query<{ content: SiteContent }>("SELECT content FROM site_content WHERE id = 1");
  res.json(normalizeSiteContent(result.rows[0]?.content || defaultSiteContent));
});

app.get("/sitemap.xml", async (_req, res) => {
  let content = memoryContent;
  let lastModified = new Date().toISOString().slice(0, 10);
  if (pool) {
    const result = await pool.query<{ content: SiteContent; updated_at: Date }>("SELECT content, updated_at FROM site_content WHERE id = 1");
    if (result.rows[0]) {
      content = normalizeSiteContent(result.rows[0].content);
      lastModified = result.rows[0].updated_at.toISOString().slice(0, 10);
    }
  }
  const paths = ["/", "/about", "/what-we-do", "/products", "/process", ...content.companies.map((company) => `/companies/${company.slug}`), "/export-markets", "/sustainability", "/gallery", "/contact"];
  const urls = paths.map((route) => `  <url><loc>${escapeXml(`https://samwatex.com${route}`)}</loc><lastmod>${lastModified}</lastmod></url>`).join("\n");
  res.type("application/xml");
  res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
});

app.get("/api/media/:id", async (req, res) => {
  if (!pool) return res.status(404).end();
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) return res.status(404).end();
  const result = await pool.query<{ file_bytes: Buffer; mime_type: string; file_name: string; updated_at: Date }>(
    "SELECT file_bytes, mime_type, file_name, updated_at FROM website_media WHERE id = $1",
    [id],
  );
  const asset = result.rows[0];
  if (!asset) return res.status(404).end();
  const etag = `\"${id}-${asset.updated_at.getTime()}-${asset.file_bytes.length}\"`;
  if (req.headers["if-none-match"] === etag) return res.status(304).end();
  res.setHeader("Content-Type", asset.mime_type);
  res.setHeader("Content-Length", String(asset.file_bytes.length));
  res.setHeader("Content-Disposition", `${asset.mime_type === "application/pdf" ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(asset.file_name)}`);
  res.setHeader("Cache-Control", "public, max-age=604800, stale-while-revalidate=86400");
  res.setHeader("ETag", etag);
  res.send(asset.file_bytes);
});

app.post("/api/admin/login", async (req, res) => {
  const username = text(req.body?.username, 40).toLowerCase() || (process.env.ADMIN_USERNAME || "admin").toLowerCase();
  const password = typeof req.body?.password === "string" ? req.body.password.slice(0, 256) : "";
  const key = loginKey(req, username);
  if (loginBlocked(key)) return res.status(429).json({ message: "Too many failed attempts. Try again later." });

  if (pool) {
    const result = await pool.query<{ id: string; username: string; password_salt: string; password_hash: string; active: boolean; role: string; session_version: number }>(
      "SELECT id, username, password_salt, password_hash, active, role, session_version FROM website_admins WHERE username = $1",
      [username],
    );
    const admin = result.rows[0];
    const validPassword = admin ? verifyPassword(password, admin.password_salt, admin.password_hash) : verifyPassword(password, dummyCredentials.salt, dummyCredentials.hash);
    if (!admin || !admin.active || !validPassword) {
      recordLoginFailure(key);
      await writeAudit(username || "unknown", "admin.login_failed", { ip: fingerprintIp(req) });
      return res.status(401).json({ message: "Incorrect username or password" });
    }
    failedLogins.delete(key);
    await pool.query("UPDATE website_admins SET last_login_at = NOW() WHERE id = $1", [admin.id]);
    await establishSession(req, { id: Number(admin.id), username: admin.username, role: admin.role, sessionVersion: admin.session_version });
    await audit(req, "admin.login", { ip: fingerprintIp(req) });
    return res.json({ ok: true, username: admin.username, role: admin.role, csrfToken: req.session.csrfToken });
  }

  const configured = process.env.ADMIN_PASSWORD;
  const configuredUsername = (process.env.ADMIN_USERNAME || "admin").toLowerCase();
  if (!configured || username !== configuredUsername || !safeEqual(password, configured)) {
    recordLoginFailure(key);
    return res.status(401).json({ message: "Incorrect username or password" });
  }
  failedLogins.delete(key);
  await establishSession(req, { username: configuredUsername, role: "owner" });
  res.json({ ok: true, username: configuredUsername, role: "owner", csrfToken: req.session.csrfToken });
});

app.get("/api/admin/session", requireAdmin, (req, res) => {
  if (!req.session.csrfToken) req.session.csrfToken = newCsrfToken();
  res.setHeader("Cache-Control", "no-store");
  res.json({ authenticated: true, username: req.session.adminUsername || "admin", role: req.session.adminRole || "admin", csrfToken: req.session.csrfToken });
});

app.post("/api/admin/logout", requireAdmin, requireCsrf, (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("samwatex.site.admin", { path: "/" });
    res.json({ ok: true });
  });
});

app.use("/api/admin", (req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method) || req.path === "/login") return next();
  return adminWriteLimit(req, res, (error?: unknown) => error ? next(error) : requireCsrf(req, res, next));
});

app.put("/api/admin/site-content", requireAdmin, async (req, res) => {
  const content = normalizeSiteContent(req.body);
  const problem = validateSiteContent(content);
  if (problem) return res.status(400).json({ message: problem });
  if (!pool) { memoryContent = content; return res.json(memoryContent); }
  const existing = await pool.query<{ content: SiteContent }>("SELECT content FROM site_content WHERE id = 1");
  if (existing.rows[0]) {
    await pool.query("INSERT INTO site_content_history (content, changed_by) VALUES ($1::jsonb, $2)", [JSON.stringify(existing.rows[0].content), req.session.adminUsername || "admin"]);
  }
  const result = await pool.query<{ content: SiteContent }>(
    `INSERT INTO site_content (id, content, updated_at) VALUES (1, $1::jsonb, NOW())
     ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW() RETURNING content`,
    [JSON.stringify(content)],
  );
  await audit(req, "content.updated");
  res.json(result.rows[0].content);
});

app.get("/api/admin/inquiries", requireAdmin, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!pool) return res.json({ inquiries: [] });
  const requestedStatus = text(req.query.status, 30);
  const status = inquiryStatuses.has(requestedStatus) ? requestedStatus : "";
  const result = status
    ? await pool.query(`SELECT id, inquiry_type AS "inquiryType", name, email, company, country, phone, whatsapp, company_interest AS "companyInterest", product_interest AS "productInterest", message, status, source_path AS "sourcePath", created_at AS "createdAt" FROM website_inquiries WHERE status = $1 ORDER BY created_at DESC LIMIT 200`, [status])
    : await pool.query(`SELECT id, inquiry_type AS "inquiryType", name, email, company, country, phone, whatsapp, company_interest AS "companyInterest", product_interest AS "productInterest", message, status, source_path AS "sourcePath", created_at AS "createdAt" FROM website_inquiries ORDER BY created_at DESC LIMIT 200`);
  res.json({ inquiries: result.rows });
});

app.patch("/api/admin/inquiries/:id", requireAdmin, async (req, res) => {
  if (!pool) return res.status(503).json({ message: "Database is not configured" });
  const status = text(req.body?.status, 30);
  const id = Number(req.params.id);
  if (!inquiryStatuses.has(status) || !Number.isSafeInteger(id) || id <= 0) return res.status(400).json({ message: "Invalid enquiry update" });
  const result = await pool.query("UPDATE website_inquiries SET status = $1 WHERE id = $2 RETURNING id, status", [status, id]);
  if (!result.rowCount) return res.status(404).json({ message: "Inquiry not found" });
  await audit(req, "inquiry.status", { id, status });
  res.json(result.rows[0]);
});

app.get("/api/admin/media", requireAdmin, async (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!pool) return res.json({ media: [] });
  const result = await pool.query(`SELECT id, file_name AS "fileName", mime_type AS "mimeType", size_bytes AS "sizeBytes", alt_text AS "altText", caption, category, sort_order AS "sortOrder", created_at AS "createdAt", updated_at AS "updatedAt" FROM website_media ORDER BY sort_order, created_at DESC`);
  res.json({ media: result.rows.map((item) => ({ ...item, url: `/api/media/${item.id}` })) });
});

app.post("/api/admin/media", requireAdmin, mediaJson, async (req, res) => {
  if (!pool) return res.status(503).json({ message: "Database is required for persistent media uploads" });
  const decoded = decodeMedia({ base64: req.body?.base64, mimeType: req.body?.mimeType });
  if ("error" in decoded) return res.status(400).json({ message: decoded.error });
  const fileName = sanitizeFileName(req.body?.fileName, decoded.mimeType);
  const altText = text(req.body?.altText, 300);
  const caption = text(req.body?.caption, 600);
  const category = text(req.body?.category, 80) || "General";
  const result = await pool.query(`INSERT INTO website_media (file_name, mime_type, file_bytes, size_bytes, alt_text, caption, category, sort_order) VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE((SELECT MAX(sort_order) + 1 FROM website_media), 0)) RETURNING id, file_name AS "fileName", mime_type AS "mimeType", size_bytes AS "sizeBytes", alt_text AS "altText", caption, category, sort_order AS "sortOrder", created_at AS "createdAt"`, [fileName, decoded.mimeType, decoded.bytes, decoded.bytes.length, altText, caption, category]);
  const asset = result.rows[0] as { id: string } & Record<string, unknown>;
  await audit(req, "media.uploaded", { id: asset.id, fileName, mimeType: decoded.mimeType, sizeBytes: decoded.bytes.length });
  res.status(201).json({ ...asset, url: `/api/media/${asset.id}` });
});

app.patch("/api/admin/media/:id", requireAdmin, async (req, res) => {
  if (!pool) return res.status(503).json({ message: "Database is not configured" });
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) return res.status(400).json({ message: "Invalid media id" });
  const result = await pool.query(`UPDATE website_media SET alt_text = $1, caption = $2, category = $3, updated_at = NOW() WHERE id = $4 RETURNING id, file_name AS "fileName", mime_type AS "mimeType", size_bytes AS "sizeBytes", alt_text AS "altText", caption, category, sort_order AS "sortOrder", updated_at AS "updatedAt"`, [text(req.body?.altText, 300), text(req.body?.caption, 600), text(req.body?.category, 80) || "General", id]);
  if (!result.rowCount) return res.status(404).json({ message: "Media not found" });
  await audit(req, "media.updated", { id });
  res.json({ ...result.rows[0], url: `/api/media/${id}` });
});

app.put("/api/admin/media/:id/content", requireAdmin, mediaJson, async (req, res) => {
  if (!pool) return res.status(503).json({ message: "Database is not configured" });
  const id = Number(req.params.id);
  const decoded = decodeMedia({ base64: req.body?.base64, mimeType: req.body?.mimeType });
  if (!Number.isSafeInteger(id) || id <= 0 || "error" in decoded) return res.status(400).json({ message: "error" in decoded ? decoded.error : "Invalid media id" });
  const fileName = sanitizeFileName(req.body?.fileName, decoded.mimeType);
  const result = await pool.query(`UPDATE website_media SET file_name = $1, mime_type = $2, file_bytes = $3, size_bytes = $4, updated_at = NOW() WHERE id = $5 RETURNING id, file_name AS "fileName", mime_type AS "mimeType", size_bytes AS "sizeBytes", alt_text AS "altText", caption, category, sort_order AS "sortOrder", updated_at AS "updatedAt"`, [fileName, decoded.mimeType, decoded.bytes, decoded.bytes.length, id]);
  if (!result.rowCount) return res.status(404).json({ message: "Media not found" });
  await audit(req, "media.replaced", { id, fileName, mimeType: decoded.mimeType, sizeBytes: decoded.bytes.length });
  res.json({ ...result.rows[0], url: `/api/media/${id}` });
});

app.post("/api/admin/media/reorder", requireAdmin, async (req, res) => {
  if (!pool) return res.status(503).json({ message: "Database is not configured" });
  const ids = Array.isArray(req.body?.ids) ? [...new Set(req.body.ids.map(Number).filter((id: number) => Number.isSafeInteger(id) && id > 0))].slice(0, 500) : [];
  await pool.query("BEGIN");
  try {
    for (let index = 0; index < ids.length; index += 1) await pool.query("UPDATE website_media SET sort_order = $1, updated_at = NOW() WHERE id = $2", [index, ids[index]]);
    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
  await audit(req, "media.reordered", { ids });
  res.json({ ok: true });
});

app.delete("/api/admin/media/:id", requireAdmin, async (req, res) => {
  if (!pool) return res.status(503).json({ message: "Database is not configured" });
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) return res.status(400).json({ message: "Invalid media id" });
  const result = await pool.query("DELETE FROM website_media WHERE id = $1 RETURNING file_name", [id]);
  if (!result.rowCount) return res.status(404).json({ message: "Media not found" });
  await audit(req, "media.deleted", { id, fileName: result.rows[0].file_name });
  res.json({ ok: true });
});

app.get("/api/admin/users", requireAdmin, async (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!pool) return res.json({ users: [] });
  const result = await pool.query(`SELECT id, username, display_name AS "displayName", role, active, last_login_at AS "lastLoginAt", created_at AS "createdAt" FROM website_admins ORDER BY created_at`);
  res.json({ users: result.rows });
});

app.post("/api/admin/users", requireAdmin, requireOwner, async (req, res) => {
  if (!pool) return res.status(503).json({ message: "Database is not configured" });
  const username = text(req.body?.username, 40).toLowerCase();
  const displayName = text(req.body?.displayName, 100) || username;
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!/^[a-z0-9._-]{3,40}$/.test(username)) return res.status(400).json({ message: "Username must use 3–40 letters, numbers, dots, dashes or underscores" });
  const problem = passwordProblem(password);
  if (problem) return res.status(400).json({ message: problem });
  const credentials = hashPassword(password);
  try {
    const result = await pool.query(`INSERT INTO website_admins (username, display_name, password_salt, password_hash, role) VALUES ($1, $2, $3, $4, 'admin') RETURNING id, username, display_name AS "displayName", role, active, last_login_at AS "lastLoginAt", created_at AS "createdAt"`, [username, displayName, credentials.salt, credentials.hash]);
    await audit(req, "admin.created", { username });
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if ((error as { code?: string }).code === "23505") return res.status(409).json({ message: "That username already exists" });
    throw error;
  }
});

app.patch("/api/admin/users/:id", requireAdmin, requireOwner, async (req, res) => {
  if (!pool) return res.status(503).json({ message: "Database is not configured" });
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) return res.status(400).json({ message: "Invalid admin id" });
  const current = await pool.query<{ id: string; username: string; display_name: string; password_salt: string; password_hash: string; active: boolean; role: string; session_version: number }>("SELECT id, username, display_name, password_salt, password_hash, active, role, session_version FROM website_admins WHERE id = $1", [id]);
  const user = current.rows[0];
  if (!user) return res.status(404).json({ message: "Admin user not found" });
  const displayName = text(req.body?.displayName, 100) || user.display_name;
  const active = typeof req.body?.active === "boolean" ? req.body.active : user.active;
  if (req.session.adminUserId === id && !active) return res.status(400).json({ message: "You cannot deactivate your own account" });
  let salt = user.password_salt;
  let hash = user.password_hash;
  let sessionVersion = user.session_version;
  const passwordChanged = typeof req.body?.password === "string" && Boolean(req.body.password);
  if (passwordChanged) {
    const problem = passwordProblem(req.body.password);
    if (problem) return res.status(400).json({ message: problem });
    const credentials = hashPassword(req.body.password);
    salt = credentials.salt;
    hash = credentials.hash;
    sessionVersion += 1;
  }
  if (active !== user.active) sessionVersion += 1;
  const result = await pool.query(`UPDATE website_admins SET display_name = $1, active = $2, password_salt = $3, password_hash = $4, session_version = $5, updated_at = NOW() WHERE id = $6 RETURNING id, username, display_name AS "displayName", role, active, last_login_at AS "lastLoginAt", created_at AS "createdAt"`, [displayName, active, salt, hash, sessionVersion, id]);
  if (req.session.adminUserId === id) req.session.adminSessionVersion = sessionVersion;
  await audit(req, "admin.updated", { id, username: user.username, active, passwordChanged });
  res.json(result.rows[0]);
});

app.get("/api/admin/audit", requireAdmin, async (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!pool) return res.json({ audit: [] });
  const result = await pool.query(`SELECT id, admin_username AS "adminUsername", action, details, created_at AS "createdAt" FROM website_admin_audit ORDER BY created_at DESC LIMIT 200`);
  res.json({ audit: result.rows });
});

app.get("/api/admin/content-history", requireAdmin, async (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  if (!pool) return res.json({ history: [] });
  const result = await pool.query(`SELECT id, changed_by AS "changedBy", created_at AS "createdAt" FROM site_content_history ORDER BY created_at DESC LIMIT 50`);
  res.json({ history: result.rows });
});

app.post("/api/contact", async (req, res) => {
  const website = text(req.body?.website, 200);
  if (website) return res.status(201).json({ ok: true });
  const startedAt = Number(req.body?.startedAt);
  const elapsed = Date.now() - startedAt;
  if (!Number.isFinite(startedAt) || elapsed < 1500 || elapsed > 24 * 60 * 60 * 1000) return res.status(400).json({ message: "Please refresh the contact form and try again." });
  const name = text(req.body?.name, 120);
  const email = text(req.body?.email, 180).toLowerCase();
  const company = text(req.body?.company, 180);
  const country = text(req.body?.country, 120);
  const phone = text(req.body?.phone, 60);
  const whatsapp = text(req.body?.whatsapp, 60);
  const companyInterest = text(req.body?.companyInterest, 180);
  const productInterest = text(req.body?.productInterest, 180);
  const message = text(req.body?.message, 4000);
  const requestedSourcePath = text(req.body?.sourcePath, 240);
  const sourcePath = requestedSourcePath.startsWith("/") && !requestedSourcePath.startsWith("//") ? requestedSourcePath : "/contact";
  const requestedType = text(req.body?.inquiryType, 30);
  const inquiryType = inquiryTypes.has(requestedType) ? requestedType : "general";
  if (name.length < 2 || !email || !country || message.length < 10) return res.status(400).json({ message: "Name, business email, country and a meaningful message are required" });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ message: "Please enter a valid business email address" });
  let reference = `SWX-${Date.now().toString(36).toUpperCase()}`;
  if (pool) {
    const duplicate = await pool.query<{ id: string }>("SELECT id FROM website_inquiries WHERE email = $1 AND message = $2 AND created_at > NOW() - INTERVAL '10 minutes' ORDER BY created_at DESC LIMIT 1", [email, message]);
    if (duplicate.rows[0]) return res.status(201).json({ ok: true, reference: `SWX-${String(duplicate.rows[0].id).padStart(6, "0")}` });
    const result = await pool.query<{ id: string }>(`INSERT INTO website_inquiries (inquiry_type, name, email, company, country, phone, whatsapp, company_interest, product_interest, message, status, source_path) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'new', $11) RETURNING id`, [inquiryType, name, email, company || null, country, phone || null, whatsapp || null, companyInterest || null, productInterest || null, message, sourcePath]);
    reference = `SWX-${String(result.rows[0].id).padStart(6, "0")}`;
  }
  res.status(201).json({ ok: true, reference });
});

app.use((error: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if ((error as { type?: string }).type === "entity.too.large") return res.status(413).json({ message: "Request is too large" });
  if (error instanceof SyntaxError) return res.status(400).json({ message: "Invalid request body" });
  next(error);
});

if (isProduction) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const publicDir = path.resolve(__dirname, "../../dist/public");
  const assetsDir = path.join(publicDir, "assets");
  const knownRoute = /^(\/|\/about|\/what-we-do|\/products|\/process|\/companies\/[a-z0-9-]+|\/export-markets|\/sustainability|\/gallery|\/contact|\/admin)$/;
  const legacyRedirects: Array<[string, string]> = [
    ["/businesses", "/what-we-do"],
    ["/industries", "/products"],
    ["/global-reach", "/export-markets"],
    ["/hmd", "/companies/hmd-international-group"],
    ["/companies", "/companies/hmd-international-group"],
    ["/about/story", "/about"],
    ["/about/vision", "/about"],
  ];
  for (const [from, to] of legacyRedirects) app.get(from, (_req, res) => res.redirect(301, to));
  app.use("/assets", express.static(assetsDir, { maxAge: "1y", immutable: true }));
  app.use(express.static(publicDir, { maxAge: "1h", index: false, dotfiles: "deny" }));
  app.get("/{*path}", (req, res) => {
    res.setHeader("Cache-Control", "no-cache");
    if (req.path.startsWith("/admin")) res.setHeader("X-Robots-Tag", "noindex, nofollow");
    if (!knownRoute.test(req.path)) res.status(404);
    res.sendFile(path.join(publicDir, "index.html"));
  });
}

async function start() {
  await initializeDatabase();
  await ensureBootstrapAdmin();
  app.listen(port, "0.0.0.0", () => console.log(`SAMWATEX website server listening on ${port}`));
}

start().catch((error) => {
  console.error("Unable to start SAMWATEX website", error);
  process.exit(1);
});
