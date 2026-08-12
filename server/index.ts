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

app.post("/api/contact", async (req, res) => {
  const { name, email, company, message } = req.body ?? {};
  if (![name, email, message].every((value) => typeof value === "string" && value.trim())) {
    return res.status(400).json({ message: "Name, email and message are required" });
  }
  if (pool) {
    await pool.query(
      "INSERT INTO website_inquiries (name, email, company, message) VALUES ($1, $2, $3, $4)",
      [name.trim(), email.trim(), typeof company === "string" ? company.trim() : null, message.trim()],
    );
  }
  res.status(201).json({ ok: true });
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
