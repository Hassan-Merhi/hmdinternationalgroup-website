import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import type { SiteContent } from "../shared/siteContent.js";
import { defaultSiteContent, normalizeSiteContent } from "../shared/siteContent.js";
import { initializeDatabase, pool } from "./db.js";

const app = express();
const port = Number(process.env.PORT || 3001);
const isProduction = process.env.NODE_ENV === "production";
let memoryContent: SiteContent = structuredClone(defaultSiteContent);

app.set("trust proxy", 1);
app.use(express.json({ limit: "1mb" }));

const PgStore = connectPgSimple(session);
const sessionStore = pool
  ? new PgStore({ pool, tableName: "website_sessions", createTableIfMissing: true })
  : undefined;

app.use(
  session({
    name: "samwatex.site.admin",
    secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString("hex"),
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 12 * 60 * 60 * 1000,
    },
  }),
);

declare module "express-session" {
  interface SessionData {
    isWebsiteAdmin?: boolean;
  }
}

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!req.session.isWebsiteAdmin) return res.status(401).json({ message: "Admin authentication required" });
  next();
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

const inquiryTypes = new Set(["general", "product", "export", "supplier", "partnership", "hmd"]);
const inquiryStatuses = new Set(["new", "read", "replied", "archived"]);

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/site-content", async (_req, res) => {
  if (!pool) return res.json(memoryContent);
  const result = await pool.query<{ content: SiteContent }>("SELECT content FROM site_content WHERE id = 1");
  res.json(normalizeSiteContent(result.rows[0]?.content || defaultSiteContent));
});

app.post("/api/admin/login", (req, res) => {
  const configured = process.env.ADMIN_PASSWORD;
  const supplied = typeof req.body?.password === "string" ? req.body.password : "";
  if (!configured) return res.status(503).json({ message: "ADMIN_PASSWORD is not configured yet" });
  if (!safeEqual(supplied, configured)) return res.status(401).json({ message: "Incorrect password" });
  req.session.isWebsiteAdmin = true;
  res.json({ ok: true });
});

app.post("/api/admin/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/admin/session", (req, res) => {
  if (!req.session.isWebsiteAdmin) return res.status(401).json({ authenticated: false });
  res.json({ authenticated: true });
});

app.put("/api/admin/site-content", requireAdmin, async (req, res) => {
  const content = normalizeSiteContent(req.body);
  if (!content || typeof content.heroTitle !== "string" || !Array.isArray(content.capabilities)) {
    return res.status(400).json({ message: "Invalid site content" });
  }
  if (!pool) {
    memoryContent = content;
    return res.json(memoryContent);
  }
  const result = await pool.query<{ content: SiteContent }>(
    `INSERT INTO site_content (id, content, updated_at)
     VALUES (1, $1::jsonb, NOW())
     ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()
     RETURNING content`,
    [JSON.stringify(content)],
  );
  res.json(result.rows[0].content);
});

app.get("/api/admin/inquiries", requireAdmin, async (req, res) => {
  if (!pool) return res.json({ inquiries: [] });
  const requestedStatus = text(req.query.status, 30);
  const status = inquiryStatuses.has(requestedStatus) ? requestedStatus : "";
  const result = status
    ? await pool.query(
        `SELECT id, inquiry_type AS "inquiryType", name, email, company, country, phone, whatsapp,
                company_interest AS "companyInterest", product_interest AS "productInterest",
                message, status, source_path AS "sourcePath", created_at AS "createdAt"
           FROM website_inquiries
          WHERE status = $1
          ORDER BY created_at DESC
          LIMIT 200`,
        [status],
      )
    : await pool.query(
        `SELECT id, inquiry_type AS "inquiryType", name, email, company, country, phone, whatsapp,
                company_interest AS "companyInterest", product_interest AS "productInterest",
                message, status, source_path AS "sourcePath", created_at AS "createdAt"
           FROM website_inquiries
          ORDER BY created_at DESC
          LIMIT 200`,
      );
  res.json({ inquiries: result.rows });
});

app.patch("/api/admin/inquiries/:id", requireAdmin, async (req, res) => {
  if (!pool) return res.status(503).json({ message: "Database is not configured" });
  const status = text(req.body?.status, 30);
  if (!inquiryStatuses.has(status)) return res.status(400).json({ message: "Invalid inquiry status" });
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) return res.status(400).json({ message: "Invalid inquiry id" });
  const result = await pool.query(
    `UPDATE website_inquiries SET status = $1 WHERE id = $2 RETURNING id, status`,
    [status, id],
  );
  if (!result.rowCount) return res.status(404).json({ message: "Inquiry not found" });
  res.json(result.rows[0]);
});

app.post("/api/contact", async (req, res) => {
  const website = text(req.body?.website, 200);
  if (website) return res.status(201).json({ ok: true });

  const name = text(req.body?.name, 120);
  const email = text(req.body?.email, 180).toLowerCase();
  const company = text(req.body?.company, 180);
  const country = text(req.body?.country, 120);
  const phone = text(req.body?.phone, 60);
  const whatsapp = text(req.body?.whatsapp, 60);
  const companyInterest = text(req.body?.companyInterest, 180);
  const productInterest = text(req.body?.productInterest, 180);
  const message = text(req.body?.message, 4000);
  const sourcePath = text(req.body?.sourcePath, 240) || "/contact";
  const requestedType = text(req.body?.inquiryType, 30);
  const inquiryType = inquiryTypes.has(requestedType) ? requestedType : "general";

  if (!name || !email || !country || !message) {
    return res.status(400).json({ message: "Name, business email, country and message are required" });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Please enter a valid business email address" });
  }

  let reference = `SWX-${Date.now().toString(36).toUpperCase()}`;
  if (pool) {
    const result = await pool.query<{ id: string }>(
      `INSERT INTO website_inquiries
        (inquiry_type, name, email, company, country, phone, whatsapp, company_interest,
         product_interest, message, status, source_path)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'new', $11)
       RETURNING id`,
      [
        inquiryType,
        name,
        email,
        company || null,
        country,
        phone || null,
        whatsapp || null,
        companyInterest || null,
        productInterest || null,
        message,
        sourcePath,
      ],
    );
    reference = `SWX-${String(result.rows[0].id).padStart(6, "0")}`;
  }
  res.status(201).json({ ok: true, reference });
});

if (isProduction) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const publicDir = path.resolve(__dirname, "../../dist/public");
  app.use(express.static(publicDir, { maxAge: "1h" }));
  app.get("/{*path}", (_req, res) => res.sendFile(path.join(publicDir, "index.html")));
}

async function start() {
  await initializeDatabase();
  app.listen(port, "0.0.0.0", () => {
    console.log(`SAMWATEX website server listening on ${port}`);
  });
}

start().catch((error) => {
  console.error("Unable to start SAMWATEX website", error);
  process.exit(1);
});
