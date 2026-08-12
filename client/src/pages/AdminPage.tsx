import { FormEvent, useEffect, useState } from "react";
import type { SiteContent } from "@shared/siteContent";
import { defaultSiteContent } from "@shared/siteContent";
import { adminLogin, adminLogout, getAdminSession, getSiteContent, saveSiteContent } from "@client/lib/api";

export function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [status, setStatus] = useState("");

  useEffect(() => {
    Promise.all([getAdminSession(), getSiteContent()]).then(([session, site]) => {
      setAuthenticated(session);
      setContent(site);
      setChecking(false);
    });
  }, []);

  async function login(event: FormEvent) {
    event.preventDefault();
    setStatus("");
    try {
      await adminLogin(password);
      setAuthenticated(true);
      setPassword("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Login failed");
    }
  }

  async function save(event: FormEvent) {
    event.preventDefault();
    setStatus("Saving…");
    try {
      const saved = await saveSiteContent(content);
      setContent(saved);
      setStatus("Saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Save failed");
    }
  }

  if (checking) return <div className="admin-screen"><p>Loading admin…</p></div>;

  if (!authenticated) {
    return (
      <div className="admin-screen">
        <form className="admin-login" onSubmit={login}>
          <div className="admin-brand">SAMWATEX</div>
          <h1>Website administration</h1>
          <p>Private access for managing SAMWATEX public website content.</p>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required /></label>
          <button className="button dark" type="submit">Sign in</button>
          {status && <p className="form-status error">{status}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <aside>
        <div className="admin-brand">SAMWATEX</div>
        <h2>Website Admin</h2>
        <p>Content foundation</p>
        <button onClick={() => void adminLogout().then(() => setAuthenticated(false))}>Sign out</button>
      </aside>
      <main>
        <div className="admin-topbar"><div><p>Public website</p><h1>Content editor</h1></div><a href="/" target="_blank" rel="noreferrer">View site ↗</a></div>
        <form className="admin-form" onSubmit={save}>
          <section>
            <h2>Brand & hero</h2>
            <label>Brand name<input value={content.brandName} onChange={(e) => setContent({ ...content, brandName: e.target.value })} /></label>
            <label>Brand descriptor<input value={content.brandDescriptor} onChange={(e) => setContent({ ...content, brandDescriptor: e.target.value })} /></label>
            <label>Eyebrow<input value={content.heroEyebrow} onChange={(e) => setContent({ ...content, heroEyebrow: e.target.value })} /></label>
            <label>Headline<textarea rows={2} value={content.heroTitle} onChange={(e) => setContent({ ...content, heroTitle: e.target.value })} /></label>
            <label>Subtitle<textarea rows={4} value={content.heroSubtitle} onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })} /></label>
            <label>Hero image URL<input placeholder="Direct photo uploads are planned for the media phase" value={content.heroImageUrl} onChange={(e) => setContent({ ...content, heroImageUrl: e.target.value })} /></label>
          </section>
          <section>
            <h2>About</h2>
            <label>Title<input value={content.aboutTitle} onChange={(e) => setContent({ ...content, aboutTitle: e.target.value })} /></label>
            <label>Body<textarea rows={7} value={content.aboutBody} onChange={(e) => setContent({ ...content, aboutBody: e.target.value })} /></label>
          </section>
          <section>
            <h2>Contact</h2>
            <label>Email<input type="email" value={content.contactEmail} onChange={(e) => setContent({ ...content, contactEmail: e.target.value })} /></label>
            <label>Phone<input value={content.contactPhone} onChange={(e) => setContent({ ...content, contactPhone: e.target.value })} /></label>
            <label>WhatsApp (optional)<input value={content.whatsappPhone} onChange={(e) => setContent({ ...content, whatsappPhone: e.target.value })} /></label>
            <label>Address<textarea rows={3} value={content.contactAddress} onChange={(e) => setContent({ ...content, contactAddress: e.target.value })} /></label>
          </section>
          <div className="admin-savebar"><button className="button dark" type="submit">Save changes</button>{status && <span>{status}</span>}</div>
        </form>
      </main>
    </div>
  );
}
