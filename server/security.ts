import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import type { SiteContent } from "../shared/siteContent.js";

declare module "express-session" {
  interface SessionData {
    csrfToken?: string;
  }
}

const production = process.env.NODE_ENV === "production";
const maxMediaBytes = 8 * 1024 * 1024;
const maxRateLimitBuckets = 5000;
const allowedMediaTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"]);
const commonPasswords = new Set(["password", "password123", "123456789012", "qwerty123456", "administrator", "letmein123456"]);

export function text(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export function safeEqual(leftValue: string, rightValue: string) {
  const left = Buffer.from(leftValue);
  const right = Buffer.from(rightValue);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")) {
  return { salt, hash: crypto.scryptSync(password, salt, 64).toString("hex") };
}

export function verifyPassword(password: string, salt: string, hash: string) {
  if (!/^[a-f0-9]{128}$/i.test(hash)) return false;
  const supplied = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  return supplied.length === expected.length && crypto.timingSafeEqual(supplied, expected);
}

export function passwordProblem(password: string) {
  if (password.length < 14) return "Password must be at least 14 characters";
  if (password.length > 128) return "Password must be 128 characters or fewer";
  if (commonPasswords.has(password.toLowerCase())) return "Choose a less common password";
  return "";
}

export function newCsrfToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function requireCsrf(req: Request, res: Response, next: NextFunction) {
  const supplied = req.get("x-csrf-token") || "";
  const expected = req.session.csrfToken || "";
  if (!supplied || !expected || !safeEqual(supplied, expected)) {
    return res.status(403).json({ message: "Security token is missing or invalid. Refresh the admin page and try again." });
  }
  next();
}

export function sameOriginGuard(req: Request, res: Response, next: NextFunction) {
  const fetchSite = req.get("sec-fetch-site");
  if (fetchSite === "cross-site") return res.status(403).json({ message: "Cross-site request blocked" });
  const origin = req.get("origin");
  if (!origin) return next();
  try {
    const parsed = new URL(origin);
    const expectedProtocol = `${req.protocol}:`;
    if (parsed.protocol !== expectedProtocol || parsed.host !== req.get("host")) {
      return res.status(403).json({ message: "Request origin is not allowed" });
    }
  } catch {
    return res.status(403).json({ message: "Request origin is not allowed" });
  }
  next();
}

export function securityHeaders(req: Request, res: Response, next: NextFunction) {
  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https:",
    "media-src 'self' https:",
    "connect-src 'self'",
    "frame-src 'none'",
    "manifest-src 'self'",
    "worker-src 'self' blob:",
  ];
  if (production) directives.push("upgrade-insecure-requests");
  res.setHeader("Content-Security-Policy", directives.join("; "));
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  res.setHeader("X-DNS-Prefetch-Control", "off");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.setHeader("Origin-Agent-Cluster", "?1");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()");
  if (req.path.startsWith("/api/admin")) {
    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
  }
  if (production) res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  next();
}

type RateState = { count: number; resetAt: number };

function trimRateBuckets(buckets: Map<string, RateState>, now: number) {
  if (buckets.size <= maxRateLimitBuckets) return;
  for (const [bucketKey, value] of buckets) {
    if (value.resetAt <= now) buckets.delete(bucketKey);
  }
  while (buckets.size > maxRateLimitBuckets) {
    const oldestKey = buckets.keys().next().value as string | undefined;
    if (!oldestKey) break;
    buckets.delete(oldestKey);
  }
}

export function createRateLimiter(options: { limit: number; windowMs: number; message: string }) {
  const buckets = new Map<string, RateState>();
  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    const key = req.ip || req.socket.remoteAddress || "unknown";
    let state = buckets.get(key);
    if (!state || state.resetAt <= now) state = { count: 0, resetAt: now + options.windowMs };
    state.count += 1;
    buckets.set(key, state);
    trimRateBuckets(buckets, now);
    res.setHeader("X-RateLimit-Limit", String(options.limit));
    res.setHeader("X-RateLimit-Remaining", String(Math.max(0, options.limit - state.count)));
    if (state.count > options.limit) {
      res.setHeader("Retry-After", String(Math.max(1, Math.ceil((state.resetAt - now) / 1000))));
      return res.status(429).json({ message: options.message });
    }
    next();
  };
}

export function fingerprintIp(req: Request) {
  return crypto.createHash("sha256").update(req.ip || req.socket.remoteAddress || "unknown").digest("hex").slice(0, 16);
}

function signatureMatches(bytes: Buffer, mimeType: string) {
  if (mimeType === "image/jpeg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mimeType === "image/png") return bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (mimeType === "image/gif") return bytes.length >= 6 && ["GIF87a", "GIF89a"].includes(bytes.subarray(0, 6).toString("ascii"));
  if (mimeType === "image/webp") return bytes.length >= 12 && bytes.subarray(0, 4).toString("ascii") === "RIFF" && bytes.subarray(8, 12).toString("ascii") === "WEBP";
  if (mimeType === "application/pdf") return bytes.length >= 5 && bytes.subarray(0, 5).toString("ascii") === "%PDF-";
  return false;
}

export function sanitizeFileName(value: unknown, mimeType: string) {
  const extension = mimeType === "image/jpeg" ? ".jpg" : mimeType === "image/png" ? ".png" : mimeType === "image/webp" ? ".webp" : mimeType === "image/gif" ? ".gif" : ".pdf";
  const requested = text(value, 160).replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/^-+|-+$/g, "");
  const stem = (requested || "upload").replace(/\.[^.]+$/, "").slice(0, 140) || "upload";
  return `${stem}${extension}`;
}

export function decodeMedia(input: { base64: unknown; mimeType: unknown }) {
  const mimeType = text(input.mimeType, 80);
  const base64 = typeof input.base64 === "string" ? input.base64 : "";
  if (!allowedMediaTypes.has(mimeType) || !base64) return { error: "Unsupported or missing media file" } as const;
  const maximumEncodedLength = Math.ceil(maxMediaBytes / 3) * 4 + 8;
  if (base64.length > maximumEncodedLength || !/^[A-Za-z0-9+/]+={0,2}$/.test(base64)) return { error: "Invalid media encoding" } as const;
  const bytes = Buffer.from(base64, "base64");
  if (!bytes.length || bytes.length > maxMediaBytes) return { error: "Media must be between 1 byte and 8 MB" } as const;
  if (!signatureMatches(bytes, mimeType)) return { error: "File contents do not match the selected file type" } as const;
  return { bytes, mimeType } as const;
}

function safeAssetUrl(value: string) {
  if (!value) return true;
  if (/^\/api\/media\/\d+$/.test(value)) return true;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || (!production && url.protocol === "http:");
  } catch {
    return false;
  }
}

function validSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 80;
}

export function validateSiteContent(content: SiteContent) {
  const serialized = JSON.stringify(content);
  if (serialized.length > 300_000) return "Website content payload is too large";
  const topStrings: Array<[string, number]> = [
    [content.brandName, 80], [content.brandDescriptor, 100], [content.heroEyebrow, 180], [content.heroTitle, 240],
    [content.heroSubtitle, 800], [content.aboutTitle, 240], [content.aboutBody, 5000], [content.capabilitiesTitle, 240],
    [content.companiesTitle, 240], [content.industriesTitle, 240], [content.marketsTitle, 240], [content.galleryTitle, 240],
    [content.statsTitle, 240], [content.contactEmail, 180], [content.contactPhone, 80], [content.whatsappPhone, 80],
    [content.contactAddress, 600], [content.footerText, 300], [content.seoTitle, 120], [content.seoDescription, 320],
  ];
  if (topStrings.some(([value, limit]) => typeof value !== "string" || value.length > limit)) return "One or more website fields exceed the allowed length";
  if (!safeAssetUrl(content.heroImageUrl) || !safeAssetUrl(content.seoSocialImageUrl)) return "Hero or social image URL is not allowed";
  if (content.capabilities.length > 30 || content.companies.length > 50 || content.industries.length > 100 || content.productCollections.length > 100 || content.markets.length > 50 || content.galleryItems.length > 250 || content.stats.length > 20) return "Too many content records in one section";
  if (content.companies.some((company) => !validSlug(company.slug) || company.focusAreas.length > 30 || company.markets.length > 50)) return "A company record is invalid";
  if (content.industries.some((industry) => !validSlug(industry.slug) || industry.highlights.length > 30 || industry.companySlugs.some((slug) => !validSlug(slug)))) return "An industry record is invalid";
  if (content.galleryItems.some((item) => item.id.length > 100 || !safeAssetUrl(item.imageUrl))) return "A gallery record is invalid";
  return "";
}
