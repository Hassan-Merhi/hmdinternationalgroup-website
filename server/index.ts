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
app.use(express.json({ limit: "12mb" }));

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
    adminUserId?: number;
    adminUsername?: string;
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

function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")) {
  return { salt, hash: crypto.scryptSync(password, salt, 64).toString("hex") };
}

function verifyPassword(password: string, salt: string, hash: string) {
  const supplied = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected);
}

async function audit(req: express.Request, action: string, details: Record<string, unknown> = {}) {
  if (!pool) return;
  const username = req.session.adminUsername || "admin";
  await pool.query(
    "INSERT INTO website_admin_audit (admin_username, action, details) VALUES ($1, $2, $3::jsonb)",
    [username, action, JSON.stringify(details)],
  );
}

async function ensureBootstrapAdmin() {
  if (!pool || !process.env.ADMIN_PASSWORD) return;
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

const inquiryTypes = new Set(["general", "product", "export", "supplier", "partnership", "hmd"]);
const inquiryStatuses = new Set(["new", "read", "replied", "archived"]);
const mediaMimeTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]);
const maxMediaBytes = 8 * 1024 * 1024;

app.get("/api/health", (_req, res) => res.json({ ok: true }));

app.get("/api/site-content", async (_req, res) => {
  if (!pool) return res.json(memoryContent);
  const result = await pool.query<{ content: SiteContent }>("SELECT content FROM site_content WHERE id = 1");
  res.json(normalizeSiteContent(result.rows[0]?.content || defaultSiteContent));
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
  res.setHeader("Content-Disposition", `inline; filename*=UTF-8''${encodeURIComponent(asset.file_name)}`);
  res.setHeader("Cache-Control", "public, max-age=86400");
  res.setHeader("ETag", etag);
  res.send(asset.file_bytes);
});

app.post("/api/admin/login", async (req, res) => {
  const username = text(req.body?.username, 60).toLowerCase() || (process.env.ADMIN_USERNAME || "admin").toLowerCase();
  const password = typeof req.body?.password === "string" ? req.body.password : "";

  if (pool) {
    const result = await pool.query<{
      id: string;
      username: string;
      password_salt: string;
      password_hash: string;
      active: boolean;
    }>(
      "SELECT id, username, password_salt, password_hash, active FROM website_admins WHERE username = $1",
      [username],
    );
    const admin = result.rows[0];
    if (!admin || !admin.active || !verifyPassword(password, admin.password_salt, admin.password_hash)) {
      return res.status(401).json({ message: "Incorrect username or password" });
    }
    req.session.isWebsiteAdmin = true;
    req.session.adminUserId = Number(admin.id);
    req.session.adminUsername = admin.username;
    await audit(req, "admin.login");
    return res.json({ ok: true, username: admin.username });
  }

  const configured = process.env.ADMIN_PASSWORD;
  const configuredUsername = (process.env.ADMIN_USERNAME || "admin").toLowerCase();
  if (!configured) return res.status(503).json({ message: "ADMIN_PASSWORD is not configured yet" });
  if (username !== configuredUsername || !safeEqual(password, configured)) {
    return res.status(401).json({ message: "Incorrect username or password" });
  }
  req.session.isWebsiteAdmin = true;
  req.session.adminUsername = configuredUsername;
  res.json({ ok: true, username: configuredUsername });
});

app.post("/api/admin/logout", (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/admin/session", (req, res) => {
  if (!req.session.isWebsiteAdmin) return res.status(401).json({ authenticated: false });
  res.json({ authenticated: true, username: req.session.adminUsername || "admin" });
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
  await audit(req, "content.updated");
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
           FROM website_inquiries WHERE status = $1 ORDER BY created_at DESC LIMIT 200`,
        [status],
      )
    : await pool.query(
        `SELECT id, inquiry_type AS "inquiryType", name, email, company, country, phone, whatsapp,
                company_interest AS "companyInterest", product_interest AS "productInterest",
                message, status, source_path AS "sourcePath", created_at AS "createdAt"
           FROM website_inquiries ORDER BY created_at DESC LIMIT 200`,
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
    "UPDATE website_inquiries SET status = $1 WHERE id = $2 RETURNING id, status",
    [status, id],
  );
  if (!result.rowCount) return res.status(404).json({ message: "Inquiry not found" });
  await audit(req, "inquiry.status", { id, status });
  res.json(result.rows[0]);
});

app.get("/api/admin/media", requireAdmin, async (_req, res) => {
  if (!pool) return res.json({ media: [] });
  const result = await pool.query(
    `SELECT id, file_name AS "fileName", mime_type AS "mimeType", size_bytes AS "sizeBytes",
            alt_text AS "altText", caption, category, sort_order AS "sortOrder",
            created_at AS "createdAt", updated_at AS "updatedAt"
       FROM website_media ORDER BY sort_order, created_at DESC`,
  );
  res.json({ media: result.rows.map((item) => ({ ...item, url: `/api/media/${item.id}` })) });
});

app.post("/api/admin/media", requireAdmin, async (req, res) => {
  if (!pool) return res.status(503).json({ message: "Database is required for persistent media uploads" });
  const fileName = text(req.body?.fileName, 180) || "upload";
  const mimeType = text(req.body?.mimeType, 80);
  const base64 = typeof req.body?.base64 === "string" ? req.body.base64 : "";
  const altText = text(req.body?.altText, 300);
  const caption = text(req.body?.caption, 600);
  const category = text(req.body?.category, 80) || "General";
  if (!mediaMimeTypes.has(mimeType) || !base64) return res.status(400).json({ message: "Unsupported or missing media file" });
  const bytes = Buffer.from(base64, "base64");
  if (!bytes.length || bytes.length > maxMediaBytes) return res.status(400).json({ message: "Media must be between 1 byte and 8 MB" });
  const result = await pool.query(
    `INSERT INTO website_media
      (file_name, mime_type, file_bytes, size_bytes, alt_text, caption, category, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, COALESCE((SELECT MAX(sort_order) + 1 FROM website_media), 0))
     RETURNING id, file_name AS "fileName", mime_type AS "mimeType", size_bytes AS "sizeBytes",
               alt_text AS "altText", caption, category, sort_order AS "sortOrder", created_at AS "createdAt"`,
    [fileName, mimeType, bytes, bytes.length, altText, caption, category],
  );
  const asset = result.rows[0] as { id: string } & Record<string, unknown>;
  await audit(req, "media.uploaded", { id: asset.id, fileName, mimeType, sizeBytes: bytes.length });
  res.status(201).json({ ...asset, url: `/api/media/${asset.id}` });
});

app.patch("/api/admin/media/:id", requireAdmin, async (req, res) => {
  if (!pool) return res.status(503).json({ message: "Database is not configured" });
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) return res.status(400).json({ message: "Invalid media id" });
  const altText = text(req.body?.altText, 300);
  const caption = text(req.body?.caption, 600);
  const category = text(req.body?.category, 80) || "General";
  const result = await pool.query(
    `UPDATE website_media SET alt_text = $1, caption = $2, category = $3, updated_at = NOW()
     WHERE id = $4
     RETURNING id, file_name AS "fileName", mime_type AS "mimeType", size_bytes AS "sizeBytes",
               alt_text AS "altText", caption, category, sort_order AS "sortOrder", updated_at AS "updatedAt"`,
    [altText, caption, category, id],
  );
  if (!result.rowCount) return res.status(404).json({ message: "Media not found" });
  await audit(req, "media.updated", { id });
  res.json({ ...result.rows[0], url: `/api/media/${id}` });
});

app.put("/api/admin/media/:id/content", requireAdmin, async (req, res) => {
  if (!pool) return res.status(503).json({ message: "Database is not configured" });
  const id = Number(req.params.id);
  const fileName = text(req.body?.fileName, 180) || "upload";
  const mimeType = text(req.body?.mimeType, 80);
  const base64 = typeof req.body?.base64 === "string" ? req.body.base64 : "";
  if (!Number.isSafeInteger(id) || id <= 0 || !mediaMimeTypes.has(mimeType) || !base64) {
    return res.status(400).json({ message: "Invalid replacement media" });
  }
  const bytes = Buffer.from(base64, "base64");
  if (!bytes.length || bytes.length > maxMediaBytes) return res.status(400).json({ message: "Media must be between 1 byte and 8 MB" });
  const result = await pool.query(
    `UPDATE website_media
        SET file_name = $1, mime_type = $2, file_bytes = $3, size_bytes = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING id, file_name AS "fileName", mime_type AS "mimeType", size_bytes AS "sizeBytes",
                alt_text AS "altText", caption, category, sort_order AS "sortOrder", updated_at AS "updatedAt"`,
    [fileName, mimeType, bytes, bytes.length, id],
  );
  if (!result.rowCount) return res.status(404).json({ message: "Media not found" });
  await audit(req, "media.replaced", { id, fileName, mimeType, sizeBytes: bytes.length });
  res.json({ ...result.rows[0], url: `/api/media/${id}` });
});

app.post("/api/admin/media/reorder", requireAdmin, async (req, res) => {
  if (!pool) return res.status(503).json({ message: "Database is not configured" });
  const ids = Array.isArray(req.body?.ids) ? req.body.ids.map(Number).filter((id: number) => Number.isSafeInteger(id) && id > 0) : [];
  for (let index = 0; index < ids.length; index += 1) {
    await pool.query("UPDATE website_media SET sort_order = $1, updated_at = NOW() WHERE id = $2", [index, ids[index]]);
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
  if (!pool) return res.json({ users: [] });
  const result = await pool.query(
    `SELECT id, username, display_name AS "displayName", role, active, created_at AS "createdAt"
       FROM website_admins ORDER BY created_at`,
  );
  res.json({ users: result.rows });
});

app.post("/api/admin/users", requireAdmin, async (req, res) => {
  if (!pool) return res.status(503).json({ message: "Database is not configured" });
  const username = text(req.body?.username, 40).toLowerCase();
  const displayName = text(req.body?.displayName, 100) || username;
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!/^[a-z0-9._-]{3,40}$/.test(username)) return res.status(400).json({ message: "Username must use 3–40 letters, numbers, dots, dashes or underscores" });
  if (password.length < 10) return res.status(400).json({ message: "Password must be at least 10 characters" });
  const credentials = hashPassword(password);
  try {
    const result = await pool.query(
      `INSERT INTO website_admins (username, display_name, password_salt, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, display_name AS "displayName", role, active, created_at AS "createdAt"`,
      [username, displayName, credentials.salt, credentials.hash],
    );
    await audit(req, "admin.created", { username });
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if ((error as { code?: string }).code === "23505") return res.status(409).json({ message: "That username already exists" });
    throw error;
  }
});

app.patch("/api/admin/users/:id", requireAdmin, async (req, res) => {
  if (!pool) return res.status(503).json({ message: "Database is not configured" });
  const id = Number(req.params.id);
  if (!Number.isSafeInteger(id) || id <= 0) return res.status(400).json({ message: "Invalid admin id" });
  const current = await pool.query<{
    id: string;
    username: string;
    display_name: string;
    password_salt: string;
    password_hash: string;
    active: boolean;
  }>("SELECT id, username, display_name, password_salt, password_hash, active FROM website_admins WHERE id = $1", [id]);
  const user = current.rows[0];
  if (!user) return res.status(404).json({ message: "Admin user not found" });
  const displayName = text(req.body?.displayName, 100) || user.display_name;
  const active = typeof req.body?.active === "boolean" ? req.body.active : user.active;
  if (req.session.adminUserId === id && !active) return res.status(400).json({ message: "You cannot deactivate your own account" });
  let salt = user.password_salt;
  let hash = user.password_hash;
  if (typeof req.body?.password === "string" && req.body.password) {
    if (req.body.password.length < 10) return res.status(400).json({ message: "Password must be at least 10 characters" });
    const credentials = hashPassword(req.body.password);
    salt = credentials.salt;
    hash = credentials.hash;
  }
  const result = await pool.query(
    `UPDATE website_admins
        SET display_name = $1, active = $2, password_salt = $3, password_hash = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING id, username, display_name AS "displayName", role, active, created_at AS "createdAt"`,
    [displayName, active, salt, hash, id],
  );
  await audit(req, "admin.updated", { id, username: user.username, active });
  res.json(result.rows[0]);
});

app.get("/api/admin/audit", requireAdmin, async (_req, res) => {
  if (!pool) return res.json({ audit: [] });
  const result = await pool.query(
    `SELECT id, admin_username AS "adminUsername", action, details, created_at AS "createdAt"
       FROM website_admin_audit ORDER BY created_at DESC LIMIT 100`,
  );
  res.json({ audit: result.rows });
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
      [inquiryType, name, email, company || null, country, phone || null, whatsapp || null,
       companyInterest || null, productInterest || null, message, sourcePath],
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
  await ensureBootstrapAdmin();
  app.listen(port, "0.0.0.0", () => {
    console.log(`SAMWATEX website server listening on ${port}`);
  });
}

start().catch((error) => {
  console.error("Unable to start SAMWATEX website", error);
  process.exit(1);
});
