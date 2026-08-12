import type { SiteContent } from "@shared/siteContent";
import { defaultSiteContent, normalizeSiteContent } from "@shared/siteContent";

export type AdminSession = { authenticated: boolean; username: string };
export type AdminInquiry = { id: string; inquiryType: string; name: string; email: string; company: string | null; country: string | null; phone: string | null; whatsapp: string | null; companyInterest: string | null; productInterest: string | null; message: string; status: "new" | "read" | "replied" | "archived"; sourcePath: string | null; createdAt: string; };
export type MediaAsset = { id: string; fileName: string; mimeType: string; sizeBytes: number; altText: string; caption: string; category: string; sortOrder: number; url: string; createdAt?: string; updatedAt?: string; };
export type AdminUser = { id: string; username: string; displayName: string; role: string; active: boolean; createdAt: string; };
export type AuditEntry = { id: string; adminUsername: string; action: string; details: Record<string, unknown>; createdAt: string; };

let siteContentPromise: Promise<SiteContent> | null = null;

async function json<T>(response: Response): Promise<T> {
  const body = (await response.json().catch(() => ({}))) as T & { message?: string };
  if (!response.ok) throw new Error(body.message || `Request failed (${response.status})`);
  return body;
}

function loadSiteContent() {
  return fetch("/api/site-content", { headers: { Accept: "application/json" } })
    .then(async (response) => {
      if (!response.ok) throw new Error("Unable to load site content");
      return normalizeSiteContent(await response.json());
    })
    .catch(() => structuredClone(defaultSiteContent));
}

export function getSiteContent(): Promise<SiteContent> {
  if (!siteContentPromise) siteContentPromise = loadSiteContent();
  return siteContentPromise;
}

export async function adminLogin(username: string, password: string): Promise<void> {
  await json(await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) }));
}
export async function adminLogout(): Promise<void> { await fetch("/api/admin/logout", { method: "POST" }); }
export async function getAdminSession(): Promise<AdminSession> {
  const response = await fetch("/api/admin/session");
  if (!response.ok) return { authenticated: false, username: "" };
  const body = (await response.json()) as Partial<AdminSession>;
  return { authenticated: true, username: body.username || "admin" };
}
export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  const response = await fetch("/api/admin/site-content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
  const saved = normalizeSiteContent(await json(response));
  siteContentPromise = Promise.resolve(saved);
  return saved;
}

export async function getInquiries(status = ""): Promise<AdminInquiry[]> {
  const query = status ? `?status=${encodeURIComponent(status)}` : "";
  return (await json<{ inquiries: AdminInquiry[] }>(await fetch(`/api/admin/inquiries${query}`))).inquiries;
}
export async function updateInquiryStatus(id: string, status: AdminInquiry["status"]): Promise<void> {
  await json(await fetch(`/api/admin/inquiries/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }));
}

export async function getMedia(): Promise<MediaAsset[]> { return (await json<{ media: MediaAsset[] }>(await fetch("/api/admin/media"))).media; }

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Unable to read file"));
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const comma = result.indexOf(",");
      if (comma === -1) return reject(new Error("Unable to encode file"));
      resolve(result.slice(comma + 1));
    };
    reader.readAsDataURL(file);
  });
}

async function optimizeImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/gif" || file.size < 650_000 || typeof createImageBitmap !== "function") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const maxDimension = 2560;
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", .86));
    if (!blob || blob.size >= file.size) return file;
    const baseName = file.name.replace(/\.[^.]+$/, "") || "image";
    return new File([blob], `${baseName}.webp`, { type: "image/webp", lastModified: Date.now() });
  } catch {
    return file;
  }
}

export async function uploadMedia(file: File, meta: { altText: string; caption: string; category: string }): Promise<MediaAsset> {
  const optimized = await optimizeImage(file);
  const base64 = await fileToBase64(optimized);
  return json<MediaAsset>(await fetch("/api/admin/media", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fileName: optimized.name, mimeType: optimized.type, base64, ...meta }) }));
}
export async function replaceMediaContent(id: string, file: File): Promise<MediaAsset> {
  const optimized = await optimizeImage(file);
  const base64 = await fileToBase64(optimized);
  return json<MediaAsset>(await fetch(`/api/admin/media/${id}/content`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fileName: optimized.name, mimeType: optimized.type, base64 }) }));
}
export async function updateMediaMeta(id: string, meta: { altText: string; caption: string; category: string }): Promise<MediaAsset> {
  return json<MediaAsset>(await fetch(`/api/admin/media/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(meta) }));
}
export async function deleteMedia(id: string): Promise<void> { await json(await fetch(`/api/admin/media/${id}`, { method: "DELETE" })); }
export async function reorderMedia(ids: string[]): Promise<void> { await json(await fetch("/api/admin/media/reorder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids }) })); }

export async function getAdminUsers(): Promise<AdminUser[]> { return (await json<{ users: AdminUser[] }>(await fetch("/api/admin/users"))).users; }
export async function createAdminUser(input: { username: string; displayName: string; password: string }): Promise<AdminUser> {
  return json<AdminUser>(await fetch("/api/admin/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) }));
}
export async function updateAdminUser(id: string, input: { displayName?: string; active?: boolean; password?: string }): Promise<AdminUser> {
  return json<AdminUser>(await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) }));
}
export async function getAdminAudit(): Promise<AuditEntry[]> { return (await json<{ audit: AuditEntry[] }>(await fetch("/api/admin/audit"))).audit; }
