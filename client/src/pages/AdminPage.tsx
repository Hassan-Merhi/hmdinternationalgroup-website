import { FormEvent, useEffect, useMemo, useState } from "react";
import type { CompanyItem, GalleryItem, IndustryItem, MarketItem, ProductCollection, SiteContent, StatItem } from "@shared/siteContent";
import { defaultSiteContent } from "@shared/siteContent";
import {
  adminLogin,
  adminLogout,
  createAdminUser,
  deleteMedia,
  getAdminAudit,
  getAdminSession,
  getAdminUsers,
  getInquiries,
  getMedia,
  getSiteContent,
  reorderMedia,
  replaceMediaContent,
  saveSiteContent,
  updateAdminUser,
  updateInquiryStatus,
  updateMediaMeta,
  uploadMedia,
  type AdminInquiry,
  type AdminUser,
  type AuditEntry,
  type MediaAsset,
} from "@client/lib/api";

type Panel = "dashboard" | "content" | "companies" | "industries" | "markets" | "gallery" | "media" | "inquiries" | "seo" | "users";

const nav: Array<[Panel, string, string]> = [
  ["dashboard", "Dashboard", "01"],
  ["content", "Homepage & About", "02"],
  ["companies", "Companies", "03"],
  ["industries", "Industries & Products", "04"],
  ["markets", "Markets & Statistics", "05"],
  ["gallery", "Gallery", "06"],
  ["media", "Media", "07"],
  ["inquiries", "Enquiries", "08"],
  ["seo", "SEO & Settings", "09"],
  ["users", "Admins & Audit", "10"],
];

function move<T>(items: T[], index: number, direction: -1 | 1) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= items.length) return items;
  const copy = [...items];
  [copy[index], copy[nextIndex]] = [copy[nextIndex], copy[index]];
  return copy;
}

function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function splitLines(value: string) {
  return value.split("\n").map((item) => item.trim()).filter(Boolean);
}

export function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [loginUsername, setLoginUsername] = useState("admin");
  const [currentUsername, setCurrentUsername] = useState("");
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [panel, setPanel] = useState<Panel>("dashboard");
  const [status, setStatus] = useState("");
  const [inquiries, setInquiries] = useState<AdminInquiry[]>([]);
  const [inquiryFilter, setInquiryFilter] = useState("");
  const [media, setMedia] = useState<MediaAsset[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [audit, setAudit] = useState<AuditEntry[]>([]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadAlt, setUploadAlt] = useState("");
  const [uploadCaption, setUploadCaption] = useState("");
  const [uploadCategory, setUploadCategory] = useState("General");
  const [newUser, setNewUser] = useState({ username: "", displayName: "", password: "" });

  async function loadPrivate() {
    const [nextInquiries, nextMedia, nextUsers, nextAudit] = await Promise.all([
      getInquiries(),
      getMedia(),
      getAdminUsers(),
      getAdminAudit(),
    ]);
    setInquiries(nextInquiries);
    setMedia(nextMedia);
    setUsers(nextUsers);
    setAudit(nextAudit);
  }

  useEffect(() => {
    Promise.all([getAdminSession(), getSiteContent()]).then(async ([session, site]) => {
      setAuthenticated(session.authenticated);
      setCurrentUsername(session.username);
      setLoginUsername(session.username || "admin");
      setContent(site);
      if (session.authenticated) {
        try { await loadPrivate(); } catch { /* private panels can retry individually */ }
      }
      setChecking(false);
    });
  }, []);

  const filteredInquiries = useMemo(
    () => inquiryFilter ? inquiries.filter((item) => item.status === inquiryFilter) : inquiries,
    [inquiries, inquiryFilter],
  );
  const newInquiryCount = inquiries.filter((item) => item.status === "new").length;
  const imageMedia = media.filter((item) => item.mimeType.startsWith("image/"));

  async function login(event: FormEvent) {
    event.preventDefault();
    setStatus("");
    try {
      await adminLogin(loginUsername, password);
      const session = await getAdminSession();
      setAuthenticated(true);
      setCurrentUsername(session.username);
      setPassword("");
      await loadPrivate();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Login failed");
    }
  }

  async function saveContent(message = "Website content saved.") {
    setStatus("Saving…");
    try {
      const saved = await saveSiteContent(content);
      setContent(saved);
      setStatus(message);
      setAudit(await getAdminAudit());
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Save failed");
    }
  }

  async function refreshInquiries(nextFilter = inquiryFilter) {
    setInquiryFilter(nextFilter);
    setInquiries(await getInquiries());
  }

  async function changeInquiry(id: string, nextStatus: AdminInquiry["status"]) {
    try {
      await updateInquiryStatus(id, nextStatus);
      setInquiries((items) => items.map((item) => item.id === id ? { ...item, status: nextStatus } : item));
      setStatus(`Enquiry marked ${nextStatus}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to update enquiry");
    }
  }

  async function handleUpload(event: FormEvent) {
    event.preventDefault();
    if (!uploadFile) return setStatus("Choose a photo or PDF first.");
    if (uploadFile.size > 8 * 1024 * 1024) return setStatus("Uploads are limited to 8 MB per file.");
    setStatus("Uploading media…");
    try {
      const asset = await uploadMedia(uploadFile, { altText: uploadAlt, caption: uploadCaption, category: uploadCategory });
      setMedia((items) => [...items, asset]);
      setUploadFile(null);
      setUploadAlt("");
      setUploadCaption("");
      setStatus("Media uploaded and ready to use.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Upload failed");
    }
  }

  async function saveMediaMeta(asset: MediaAsset) {
    try {
      const saved = await updateMediaMeta(asset.id, { altText: asset.altText, caption: asset.caption, category: asset.category });
      setMedia((items) => items.map((item) => item.id === asset.id ? saved : item));
      setStatus("Media details saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save media details");
    }
  }

  async function replaceAsset(asset: MediaAsset, file: File) {
    if (file.size > 8 * 1024 * 1024) return setStatus("Replacement files are limited to 8 MB.");
    try {
      const saved = await replaceMediaContent(asset.id, file);
      setMedia((items) => items.map((item) => item.id === asset.id ? { ...item, ...saved } : item));
      setStatus("Media file replaced without changing its website URL.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to replace media");
    }
  }

  async function removeAsset(asset: MediaAsset) {
    if (!window.confirm(`Delete ${asset.fileName}?`)) return;
    try {
      const nextContent = {
        ...content,
        heroImageUrl: content.heroImageUrl === asset.url ? "" : content.heroImageUrl,
        seoSocialImageUrl: content.seoSocialImageUrl === asset.url ? "" : content.seoSocialImageUrl,
        galleryItems: content.galleryItems.map((item) => item.imageUrl === asset.url ? { ...item, imageUrl: "" } : item),
      };
      if (JSON.stringify(nextContent) !== JSON.stringify(content)) {
        const saved = await saveSiteContent(nextContent);
        setContent(saved);
      }
      await deleteMedia(asset.id);
      setMedia((items) => items.filter((item) => item.id !== asset.id));
      setStatus("Media deleted and removed from website references.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to delete media");
    }
  }

  async function moveMedia(index: number, direction: -1 | 1) {
    const next = move(media, index, direction);
    setMedia(next);
    await reorderMedia(next.map((item) => item.id));
  }

  async function setHeroAsset(asset: MediaAsset) {
    const next = { ...content, heroImageUrl: asset.url };
    setContent(next);
    try {
      setContent(await saveSiteContent(next));
      setStatus("Hero image updated.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to set hero image");
    }
  }

  async function addUser(event: FormEvent) {
    event.preventDefault();
    try {
      const user = await createAdminUser(newUser);
      setUsers((items) => [...items, user]);
      setNewUser({ username: "", displayName: "", password: "" });
      setStatus("Administrator created.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to create administrator");
    }
  }

  async function toggleUser(user: AdminUser) {
    try {
      const saved = await updateAdminUser(user.id, { active: !user.active });
      setUsers((items) => items.map((item) => item.id === user.id ? saved : item));
      setStatus(saved.active ? "Administrator activated." : "Administrator deactivated.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to update administrator");
    }
  }

  if (checking) return <div className="admin-screen"><div className="admin-loading-mark">SAMWATEX</div><p>Loading administration…</p></div>;

  if (!authenticated) {
    return (
      <div className="admin-screen admin-login-screen">
        <div className="admin-login-art" aria-hidden="true"><span>SWX</span><i /></div>
        <form className="admin-login" onSubmit={login}>
          <div className="admin-brand">SAMWATEX</div>
          <p className="admin-kicker">Private website administration</p>
          <h1>Control the public brand from one place.</h1>
          <label>Username<input value={loginUsername} onChange={(event) => setLoginUsername(event.target.value)} autoComplete="username" required /></label>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
          <button className="button dark" type="submit">Sign in</button>
          {status && <p className="form-status error">{status}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="cms-shell">
      <aside className="cms-sidebar">
        <div className="cms-brand"><strong>SAMWATEX</strong><span>Website CMS</span></div>
        <nav aria-label="CMS navigation">
          {nav.map(([id, label, number]) => (
            <button className={panel === id ? "active" : ""} key={id} onClick={() => setPanel(id)}>
              <span>{number}</span>{label}{id === "inquiries" && newInquiryCount > 0 && <b>{newInquiryCount}</b>}
            </button>
          ))}
        </nav>
        <div className="cms-sidebar-footer">
          <span>Signed in as</span><strong>{currentUsername}</strong>
          <button onClick={() => void adminLogout().then(() => setAuthenticated(false))}>Sign out</button>
        </div>
      </aside>

      <main className="cms-main">
        <header className="cms-topbar">
          <div><p>SAMWATEX / ADMIN</p><h1>{nav.find(([id]) => id === panel)?.[1]}</h1></div>
          <div className="cms-top-actions"><a href="/" target="_blank" rel="noreferrer">View live site ↗</a>{panel !== "dashboard" && panel !== "media" && panel !== "inquiries" && panel !== "users" && <button onClick={() => void saveContent()}>Save website</button>}</div>
        </header>

        {status && <div className="cms-status" role="status">{status}<button onClick={() => setStatus("")} aria-label="Dismiss">×</button></div>}

        {panel === "dashboard" && (
          <div className="cms-dashboard">
            <section className="cms-metric-grid">
              <article><span>Companies</span><strong>{content.companies.length}</strong><p>Operating companies published</p></article>
              <article><span>Industries</span><strong>{content.industries.length}</strong><p>Commercial areas represented</p></article>
              <article><span>Media</span><strong>{media.length}</strong><p>Persistent assets in the library</p></article>
              <article><span>New enquiries</span><strong>{newInquiryCount}</strong><p>Business messages needing review</p></article>
            </section>
            <section className="cms-dashboard-grid">
              <div className="cms-panel-card">
                <div className="cms-card-heading"><div><p>Recent enquiries</p><h2>Commercial inbox</h2></div><button onClick={() => setPanel("inquiries")}>Open all ↗</button></div>
                <div className="cms-mini-list">
                  {inquiries.slice(0, 5).map((item) => <button key={item.id} onClick={() => setPanel("inquiries")}><span className={`inquiry-dot ${item.status}`} /><div><strong>{item.name}</strong><small>{item.inquiryType} · {item.country || "No market"}</small></div><time>{formatDate(item.createdAt)}</time></button>)}
                  {!inquiries.length && <p className="cms-empty">No enquiries yet.</p>}
                </div>
              </div>
              <div className="cms-panel-card">
                <div className="cms-card-heading"><div><p>Activity</p><h2>Admin audit</h2></div></div>
                <div className="cms-audit-list">
                  {audit.slice(0, 7).map((entry) => <div key={entry.id}><span>{entry.action}</span><strong>{entry.adminUsername}</strong><time>{formatDate(entry.createdAt)}</time></div>)}
                  {!audit.length && <p className="cms-empty">Activity will appear here.</p>}
                </div>
              </div>
            </section>
          </div>
        )}

        {panel === "content" && (
          <div className="cms-editor-grid">
            <section className="cms-form-card wide">
              <div className="cms-card-heading"><div><p>Homepage</p><h2>Brand & hero</h2></div></div>
              <div className="cms-form-grid">
                <label>Brand name<input value={content.brandName} onChange={(e) => setContent({ ...content, brandName: e.target.value })} /></label>
                <label>Descriptor<input value={content.brandDescriptor} onChange={(e) => setContent({ ...content, brandDescriptor: e.target.value })} /></label>
                <label className="span-2">Hero eyebrow<input value={content.heroEyebrow} onChange={(e) => setContent({ ...content, heroEyebrow: e.target.value })} /></label>
                <label className="span-2">Headline<textarea rows={3} value={content.heroTitle} onChange={(e) => setContent({ ...content, heroTitle: e.target.value })} /></label>
                <label className="span-2">Subtitle<textarea rows={4} value={content.heroSubtitle} onChange={(e) => setContent({ ...content, heroSubtitle: e.target.value })} /></label>
                <label className="span-2">Hero image<select value={content.heroImageUrl} onChange={(e) => setContent({ ...content, heroImageUrl: e.target.value })}><option value="">No image / branded artwork</option>{imageMedia.map((asset) => <option value={asset.url} key={asset.id}>{asset.fileName}</option>)}</select></label>
              </div>
            </section>
            <section className="cms-form-card wide">
              <div className="cms-card-heading"><div><p>About</p><h2>Core company story</h2></div></div>
              <label>Title<input value={content.aboutTitle} onChange={(e) => setContent({ ...content, aboutTitle: e.target.value })} /></label>
              <label>Body<textarea rows={7} value={content.aboutBody} onChange={(e) => setContent({ ...content, aboutBody: e.target.value })} /></label>
            </section>
            <section className="cms-form-card wide">
              <div className="cms-card-heading"><div><p>Homepage</p><h2>Capabilities</h2></div><button onClick={() => setContent({ ...content, capabilities: [...content.capabilities, { eyebrow: String(content.capabilities.length + 1).padStart(2, "0"), title: "New capability", description: "" }] })}>+ Add</button></div>
              <label>Section title<input value={content.capabilitiesTitle} onChange={(e) => setContent({ ...content, capabilitiesTitle: e.target.value })} /></label>
              <div className="cms-repeater">
                {content.capabilities.map((item, index) => <article key={`${item.title}-${index}`}><div className="repeater-toolbar"><span>{item.eyebrow}</span><div><button onClick={() => setContent({ ...content, capabilities: move(content.capabilities, index, -1) })}>↑</button><button onClick={() => setContent({ ...content, capabilities: move(content.capabilities, index, 1) })}>↓</button><button onClick={() => setContent({ ...content, capabilities: content.capabilities.filter((_, i) => i !== index) })}>Remove</button></div></div><input value={item.title} onChange={(e) => { const next = [...content.capabilities]; next[index] = { ...item, title: e.target.value }; setContent({ ...content, capabilities: next }); }} /><textarea rows={3} value={item.description} onChange={(e) => { const next = [...content.capabilities]; next[index] = { ...item, description: e.target.value }; setContent({ ...content, capabilities: next }); }} /></article>)}
              </div>
            </section>
          </div>
        )}

        {panel === "companies" && (
          <div className="cms-editor-grid">
            <section className="cms-form-card wide">
              <div className="cms-card-heading"><div><p>Group portfolio</p><h2>Operating companies</h2></div><button onClick={() => setContent({ ...content, companies: [...content.companies, { slug: `company-${Date.now()}`, name: "New Company", shortName: "NEW", relationship: "A SAMWATEX Company", tagline: "", description: "", overview: "", focusAreas: [], markets: [] }] })}>+ Add company</button></div>
              <label>Section title<input value={content.companiesTitle} onChange={(e) => setContent({ ...content, companiesTitle: e.target.value })} /></label>
              <div className="cms-repeater company-editor-list">
                {content.companies.map((company, index) => <CompanyEditor key={`${company.slug}-${index}`} company={company} index={index} onChange={(next) => { const companies = [...content.companies]; companies[index] = next; setContent({ ...content, companies }); }} onMove={(direction) => setContent({ ...content, companies: move(content.companies, index, direction) })} onRemove={() => setContent({ ...content, companies: content.companies.filter((_, i) => i !== index) })} />)}
              </div>
            </section>
          </div>
        )}

        {panel === "industries" && (
          <div className="cms-editor-grid">
            <section className="cms-form-card wide">
              <div className="cms-card-heading"><div><p>Commercial areas</p><h2>Industries</h2></div><button onClick={() => setContent({ ...content, industries: [...content.industries, { slug: `industry-${Date.now()}`, eyebrow: String(content.industries.length + 1).padStart(2, "0"), title: "New industry", description: "", highlights: [], companySlugs: [] }] })}>+ Add industry</button></div>
              <label>Section title<input value={content.industriesTitle} onChange={(e) => setContent({ ...content, industriesTitle: e.target.value })} /></label>
              <div className="cms-repeater">
                {content.industries.map((industry, index) => <IndustryEditor key={`${industry.slug}-${index}`} industry={industry} companies={content.companies} onChange={(next) => { const industries = [...content.industries]; industries[index] = next; setContent({ ...content, industries }); }} onMove={(direction) => setContent({ ...content, industries: move(content.industries, index, direction) })} onRemove={() => setContent({ ...content, industries: content.industries.filter((_, i) => i !== index) })} />)}
              </div>
            </section>
            <section className="cms-form-card wide">
              <div className="cms-card-heading"><div><p>Product framework</p><h2>Product collections</h2></div><button onClick={() => setContent({ ...content, productCollections: [...content.productCollections, { title: "New collection", description: "", examples: [] }] })}>+ Add collection</button></div>
              <div className="cms-repeater compact-repeater">
                {content.productCollections.map((collection, index) => <ProductEditor key={`${collection.title}-${index}`} collection={collection} onChange={(next) => { const productCollections = [...content.productCollections]; productCollections[index] = next; setContent({ ...content, productCollections }); }} onRemove={() => setContent({ ...content, productCollections: content.productCollections.filter((_, i) => i !== index) })} />)}
              </div>
            </section>
          </div>
        )}

        {panel === "markets" && (
          <div className="cms-editor-grid">
            <section className="cms-form-card wide">
              <div className="cms-card-heading"><div><p>Global reach</p><h2>Export markets</h2></div><button onClick={() => setContent({ ...content, markets: [...content.markets, { region: "New market", description: "" }] })}>+ Add market</button></div>
              <label>Section title<input value={content.marketsTitle} onChange={(e) => setContent({ ...content, marketsTitle: e.target.value })} /></label>
              <div className="cms-repeater compact-repeater">{content.markets.map((market, index) => <MarketEditor key={`${market.region}-${index}`} market={market} onChange={(next) => { const markets = [...content.markets]; markets[index] = next; setContent({ ...content, markets }); }} onRemove={() => setContent({ ...content, markets: content.markets.filter((_, i) => i !== index) })} />)}</div>
            </section>
            <section className="cms-form-card wide">
              <div className="cms-card-heading"><div><p>Homepage proof points</p><h2>Statistics</h2></div><button onClick={() => setContent({ ...content, stats: [...content.stats, { value: "Value", label: "Label" }] })}>+ Add statistic</button></div>
              <label>Section title<input value={content.statsTitle} onChange={(e) => setContent({ ...content, statsTitle: e.target.value })} /></label>
              <div className="cms-stat-editor">{content.stats.map((stat, index) => <StatEditor key={`${stat.label}-${index}`} stat={stat} onChange={(next) => { const stats = [...content.stats]; stats[index] = next; setContent({ ...content, stats }); }} onRemove={() => setContent({ ...content, stats: content.stats.filter((_, i) => i !== index) })} />)}</div>
            </section>
          </div>
        )}

        {panel === "gallery" && (
          <div className="cms-editor-grid">
            <section className="cms-form-card wide">
              <div className="cms-card-heading"><div><p>Visual storytelling</p><h2>Gallery entries</h2></div><button onClick={() => setContent({ ...content, galleryItems: [...content.galleryItems, { id: `gallery-${Date.now()}`, category: "SAMWATEX", company: "SAMWATEX", title: "New gallery story", description: "", imageUrl: "" }] })}>+ Add entry</button></div>
              <label>Gallery title<input value={content.galleryTitle} onChange={(e) => setContent({ ...content, galleryTitle: e.target.value })} /></label>
              <div className="cms-gallery-editor">{content.galleryItems.map((item, index) => <GalleryEditor key={`${item.id}-${index}`} item={item} media={imageMedia} onChange={(next) => { const galleryItems = [...content.galleryItems]; galleryItems[index] = next; setContent({ ...content, galleryItems }); }} onMove={(direction) => setContent({ ...content, galleryItems: move(content.galleryItems, index, direction) })} onRemove={() => setContent({ ...content, galleryItems: content.galleryItems.filter((_, i) => i !== index) })} />)}</div>
            </section>
          </div>
        )}

        {panel === "media" && (
          <div className="cms-media-page">
            <form className="cms-upload-card" onSubmit={handleUpload}>
              <div><p>Persistent media library</p><h2>Upload a new asset</h2><small>JPEG, PNG, WebP, GIF or PDF · maximum 8 MB</small></div>
              <div className="cms-upload-grid">
                <label className="file-drop"><input type="file" accept="image/jpeg,image/png,image/webp,image/gif,application/pdf" onChange={(e) => setUploadFile(e.target.files?.[0] || null)} /><span>{uploadFile ? uploadFile.name : "Choose photo or PDF"}</span></label>
                <label>Category<input value={uploadCategory} onChange={(e) => setUploadCategory(e.target.value)} /></label>
                <label>Alt text<input value={uploadAlt} onChange={(e) => setUploadAlt(e.target.value)} placeholder="Describe the image for accessibility" /></label>
                <label>Caption<input value={uploadCaption} onChange={(e) => setUploadCaption(e.target.value)} /></label>
                <button type="submit">Upload asset</button>
              </div>
            </form>
            <section className="cms-media-library">
              <div className="cms-card-heading"><div><p>Library</p><h2>{media.length} assets</h2></div></div>
              <div className="cms-media-grid">
                {media.map((asset, index) => <article className="cms-media-card" key={asset.id}>
                  <div className="cms-media-preview">{asset.mimeType.startsWith("image/") ? <img src={asset.url} alt={asset.altText || asset.fileName} loading="lazy" /> : <div className="pdf-preview">PDF</div>}<span>{asset.category}</span></div>
                  <div className="cms-media-body"><strong>{asset.fileName}</strong><small>{formatBytes(asset.sizeBytes)}</small><label>Alt text<input value={asset.altText} onChange={(e) => setMedia((items) => items.map((item) => item.id === asset.id ? { ...item, altText: e.target.value } : item))} /></label><label>Caption<input value={asset.caption} onChange={(e) => setMedia((items) => items.map((item) => item.id === asset.id ? { ...item, caption: e.target.value } : item))} /></label><label>Category<input value={asset.category} onChange={(e) => setMedia((items) => items.map((item) => item.id === asset.id ? { ...item, category: e.target.value } : item))} /></label></div>
                  <div className="cms-media-actions"><button onClick={() => void saveMediaMeta(asset)}>Save</button>{asset.mimeType.startsWith("image/") && <button onClick={() => void setHeroAsset(asset)}>Use as hero</button>}<label className="replace-button">Replace<input type="file" accept="image/jpeg,image/png,image/webp,image/gif,application/pdf" onChange={(e) => { const file = e.target.files?.[0]; if (file) void replaceAsset(asset, file); e.currentTarget.value = ""; }} /></label><button onClick={() => void moveMedia(index, -1)}>↑</button><button onClick={() => void moveMedia(index, 1)}>↓</button><button className="danger" onClick={() => void removeAsset(asset)}>Delete</button></div>
                </article>)}
                {!media.length && <p className="cms-empty">Upload your first SAMWATEX photo to start the media library.</p>}
              </div>
            </section>
          </div>
        )}

        {panel === "inquiries" && (
          <div className="cms-inquiries-page">
            <div className="cms-inquiry-filters">{["", "new", "read", "replied", "archived"].map((filter) => <button className={inquiryFilter === filter ? "active" : ""} key={filter || "all"} onClick={() => void refreshInquiries(filter)}>{filter || "all"}<span>{filter ? inquiries.filter((item) => item.status === filter).length : inquiries.length}</span></button>)}</div>
            <div className="cms-inquiry-list">{filteredInquiries.map((item) => <article key={item.id} className={`cms-inquiry-card ${item.status}`}><div className="inquiry-head"><div><span>{item.inquiryType}</span><h2>{item.name}</h2><p>{item.company || "Individual enquiry"} · {item.country || "Market not supplied"}</p></div><div><time>{formatDate(item.createdAt)}</time><strong>SWX-{String(item.id).padStart(6, "0")}</strong></div></div><div className="inquiry-meta"><a href={`mailto:${item.email}`}>{item.email}</a>{item.phone && <a href={`tel:${item.phone}`}>{item.phone}</a>}{item.whatsapp && <span>WhatsApp {item.whatsapp}</span>}{item.companyInterest && <span>Interest: {item.companyInterest}</span>}{item.productInterest && <span>Product: {item.productInterest}</span>}</div><p className="inquiry-message">{item.message}</p><div className="inquiry-actions"><select value={item.status} onChange={(e) => void changeInquiry(item.id, e.target.value as AdminInquiry["status"])}><option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option><option value="archived">Archived</option></select><a href={`mailto:${item.email}?subject=${encodeURIComponent(`SAMWATEX enquiry SWX-${String(item.id).padStart(6, "0")}`)}`}>Reply by email ↗</a></div></article>)}{!filteredInquiries.length && <p className="cms-empty">No enquiries in this view.</p>}</div>
          </div>
        )}

        {panel === "seo" && (
          <div className="cms-editor-grid">
            <section className="cms-form-card wide"><div className="cms-card-heading"><div><p>Search & sharing</p><h2>SEO defaults</h2></div></div><label>Site title<input value={content.seoTitle} onChange={(e) => setContent({ ...content, seoTitle: e.target.value })} /></label><label>Description<textarea rows={5} value={content.seoDescription} onChange={(e) => setContent({ ...content, seoDescription: e.target.value })} /></label><label>Social sharing image<select value={content.seoSocialImageUrl} onChange={(e) => setContent({ ...content, seoSocialImageUrl: e.target.value })}><option value="">Use hero / no custom image</option>{imageMedia.map((asset) => <option value={asset.url} key={asset.id}>{asset.fileName}</option>)}</select></label></section>
            <section className="cms-form-card wide"><div className="cms-card-heading"><div><p>Business details</p><h2>Contact & footer</h2></div></div><div className="cms-form-grid"><label>Email<input type="email" value={content.contactEmail} onChange={(e) => setContent({ ...content, contactEmail: e.target.value })} /></label><label>Phone<input value={content.contactPhone} onChange={(e) => setContent({ ...content, contactPhone: e.target.value })} /></label><label>WhatsApp<input value={content.whatsappPhone} onChange={(e) => setContent({ ...content, whatsappPhone: e.target.value })} /></label><label>Footer text<input value={content.footerText} onChange={(e) => setContent({ ...content, footerText: e.target.value })} /></label><label className="span-2">Address<textarea rows={4} value={content.contactAddress} onChange={(e) => setContent({ ...content, contactAddress: e.target.value })} /></label></div></section>
          </div>
        )}

        {panel === "users" && (
          <div className="cms-users-page">
            <form className="cms-form-card" onSubmit={addUser}><div className="cms-card-heading"><div><p>Access</p><h2>Add administrator</h2></div></div><label>Username<input value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} required /></label><label>Display name<input value={newUser.displayName} onChange={(e) => setNewUser({ ...newUser, displayName: e.target.value })} required /></label><label>Temporary password<input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} minLength={10} required /></label><button className="cms-primary-button" type="submit">Create administrator</button></form>
            <section className="cms-form-card"><div className="cms-card-heading"><div><p>Access</p><h2>Administrators</h2></div></div><div className="cms-user-list">{users.map((user) => <div key={user.id}><div><strong>{user.displayName}</strong><span>@{user.username} · {user.role}</span></div><button className={user.active ? "active-user" : ""} onClick={() => void toggleUser(user)}>{user.active ? "Active" : "Inactive"}</button></div>)}</div></section>
            <section className="cms-form-card span-full"><div className="cms-card-heading"><div><p>Audit history</p><h2>Recent admin activity</h2></div><button onClick={() => void getAdminAudit().then(setAudit)}>Refresh</button></div><div className="cms-audit-table">{audit.map((entry) => <div key={entry.id}><time>{formatDate(entry.createdAt)}</time><strong>{entry.adminUsername}</strong><span>{entry.action}</span></div>)}</div></section>
          </div>
        )}
      </main>
    </div>
  );
}

function CompanyEditor({ company, index, onChange, onMove, onRemove }: { company: CompanyItem; index: number; onChange: (value: CompanyItem) => void; onMove: (direction: -1 | 1) => void; onRemove: () => void }) {
  return <article><div className="repeater-toolbar"><span>Company {String(index + 1).padStart(2, "0")}</span><div><button onClick={() => onMove(-1)}>↑</button><button onClick={() => onMove(1)}>↓</button><button onClick={onRemove}>Remove</button></div></div><div className="cms-form-grid"><label>Name<input value={company.name} onChange={(e) => onChange({ ...company, name: e.target.value })} /></label><label>Short name<input value={company.shortName} onChange={(e) => onChange({ ...company, shortName: e.target.value })} /></label><label>URL slug<input value={company.slug} onChange={(e) => onChange({ ...company, slug: slugify(e.target.value) })} /></label><label>Relationship<input value={company.relationship} onChange={(e) => onChange({ ...company, relationship: e.target.value })} /></label><label className="span-2">Tagline<input value={company.tagline} onChange={(e) => onChange({ ...company, tagline: e.target.value })} /></label><label className="span-2">Short description<textarea rows={3} value={company.description} onChange={(e) => onChange({ ...company, description: e.target.value })} /></label><label className="span-2">Overview<textarea rows={5} value={company.overview} onChange={(e) => onChange({ ...company, overview: e.target.value })} /></label><label>Focus areas · one per line<textarea rows={5} value={company.focusAreas.join("\n")} onChange={(e) => onChange({ ...company, focusAreas: splitLines(e.target.value) })} /></label><label>Markets · one per line<textarea rows={5} value={company.markets.join("\n")} onChange={(e) => onChange({ ...company, markets: splitLines(e.target.value) })} /></label></div></article>;
}

function IndustryEditor({ industry, companies, onChange, onMove, onRemove }: { industry: IndustryItem; companies: CompanyItem[]; onChange: (value: IndustryItem) => void; onMove: (direction: -1 | 1) => void; onRemove: () => void }) {
  return <article><div className="repeater-toolbar"><span>{industry.eyebrow}</span><div><button onClick={() => onMove(-1)}>↑</button><button onClick={() => onMove(1)}>↓</button><button onClick={onRemove}>Remove</button></div></div><div className="cms-form-grid"><label>Title<input value={industry.title} onChange={(e) => onChange({ ...industry, title: e.target.value })} /></label><label>Slug<input value={industry.slug} onChange={(e) => onChange({ ...industry, slug: slugify(e.target.value) })} /></label><label className="span-2">Description<textarea rows={4} value={industry.description} onChange={(e) => onChange({ ...industry, description: e.target.value })} /></label><label>Highlights · one per line<textarea rows={4} value={industry.highlights.join("\n")} onChange={(e) => onChange({ ...industry, highlights: splitLines(e.target.value) })} /></label><label>Operating companies<select multiple value={industry.companySlugs} onChange={(e) => onChange({ ...industry, companySlugs: Array.from(e.target.selectedOptions).map((option) => option.value) })}>{companies.map((company) => <option key={company.slug} value={company.slug}>{company.name}</option>)}</select></label></div></article>;
}

function ProductEditor({ collection, onChange, onRemove }: { collection: ProductCollection; onChange: (value: ProductCollection) => void; onRemove: () => void }) {
  return <article><div className="repeater-toolbar"><span>Collection</span><button onClick={onRemove}>Remove</button></div><label>Title<input value={collection.title} onChange={(e) => onChange({ ...collection, title: e.target.value })} /></label><label>Description<textarea rows={3} value={collection.description} onChange={(e) => onChange({ ...collection, description: e.target.value })} /></label><label>Examples · one per line<textarea rows={4} value={collection.examples.join("\n")} onChange={(e) => onChange({ ...collection, examples: splitLines(e.target.value) })} /></label></article>;
}

function MarketEditor({ market, onChange, onRemove }: { market: MarketItem; onChange: (value: MarketItem) => void; onRemove: () => void }) {
  return <article><div className="repeater-toolbar"><span>Market</span><button onClick={onRemove}>Remove</button></div><label>Region<input value={market.region} onChange={(e) => onChange({ ...market, region: e.target.value })} /></label><label>Description<textarea rows={3} value={market.description} onChange={(e) => onChange({ ...market, description: e.target.value })} /></label></article>;
}

function StatEditor({ stat, onChange, onRemove }: { stat: StatItem; onChange: (value: StatItem) => void; onRemove: () => void }) {
  return <article><button onClick={onRemove}>×</button><input value={stat.value} onChange={(e) => onChange({ ...stat, value: e.target.value })} /><input value={stat.label} onChange={(e) => onChange({ ...stat, label: e.target.value })} /></article>;
}

function GalleryEditor({ item, media, onChange, onMove, onRemove }: { item: GalleryItem; media: MediaAsset[]; onChange: (value: GalleryItem) => void; onMove: (direction: -1 | 1) => void; onRemove: () => void }) {
  return <article><div className="gallery-editor-preview">{item.imageUrl ? <img src={item.imageUrl} alt="" /> : <span>{item.category}</span>}</div><div className="gallery-editor-fields"><div className="repeater-toolbar"><span>{item.category}</span><div><button onClick={() => onMove(-1)}>↑</button><button onClick={() => onMove(1)}>↓</button><button onClick={onRemove}>Remove</button></div></div><div className="cms-form-grid"><label>Title<input value={item.title} onChange={(e) => onChange({ ...item, title: e.target.value })} /></label><label>Category<input value={item.category} onChange={(e) => onChange({ ...item, category: e.target.value })} /></label><label>Company<input value={item.company} onChange={(e) => onChange({ ...item, company: e.target.value })} /></label><label>Image<select value={item.imageUrl} onChange={(e) => onChange({ ...item, imageUrl: e.target.value })}><option value="">Placeholder artwork</option>{media.map((asset) => <option value={asset.url} key={asset.id}>{asset.fileName}</option>)}</select></label><label className="span-2">Description<textarea rows={3} value={item.description} onChange={(e) => onChange({ ...item, description: e.target.value })} /></label></div></div></article>;
}
