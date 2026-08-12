import type { SiteContent } from "@shared/siteContent";
import { defaultSiteContent } from "@shared/siteContent";

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const response = await fetch("/api/site-content");
    if (!response.ok) throw new Error("Unable to load site content");
    return (await response.json()) as SiteContent;
  } catch {
    return defaultSiteContent;
  }
}

export async function adminLogin(password: string): Promise<void> {
  const response = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message || "Login failed");
  }
}

export async function adminLogout(): Promise<void> {
  await fetch("/api/admin/logout", { method: "POST" });
}

export async function getAdminSession(): Promise<boolean> {
  const response = await fetch("/api/admin/session");
  return response.ok;
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  const response = await fetch("/api/admin/site-content", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(content),
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as { message?: string };
    throw new Error(body.message || "Unable to save content");
  }
  return (await response.json()) as SiteContent;
}
