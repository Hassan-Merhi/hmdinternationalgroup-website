import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { SiteContent } from "@shared/siteContent";
import { defaultSiteContent } from "@shared/siteContent";
import { getSiteContent } from "@client/lib/api";

const galleryGuide = [
  ["Sorting", "Sorting floor, category separation and working tables"],
  ["Products", "Men's, women's, children's, footwear, bags and household textiles"],
  ["Bales", "Finished bale preparation, identification and warehouse staging"],
  ["Loading", "Container loading and export preparation"],
  ["HMD", "Commercial team, buyer-facing activity and HMD operations"],
  ["Facility", "Warehouse, equipment and the physical operating environment"],
] as const;

export function GalleryPage() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [category, setCategory] = useState("All");

  useEffect(() => { void getSiteContent().then(setContent); }, []);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(content.galleryItems.map((item) => item.category).filter(Boolean)))],
    [content.galleryItems],
  );
  const visibleItems = category === "All" ? content.galleryItems : content.galleryItems.filter((item) => item.category === category);
  const withPhotos = content.galleryItems.filter((item) => Boolean(item.imageUrl)).length;

  return (
    <div className="inner-page gallery-page textile-gallery-page">
      <section className="page-hero gallery-hero textile-page-hero">
        <p className="eyebrow light">Operations gallery</p>
        <h1>The sorting floor, the product, the bales and the work behind export.</h1>
        <p className="page-hero-copy">This gallery is built to become a real visual record of SAMWATEX and HMD operations as your own photography is added through the private website admin.</p>
      </section>

      <section className="gallery-intro section-pad">
        <div className="section-heading-row">
          <div><p className="eyebrow">Visual proof</p><h2>Show the operation instead of describing it endlessly.</h2></div>
          <p className="section-note">{withPhotos} of {content.galleryItems.length} published gallery entries currently have uploaded photography. Empty entries remain structured and ready for your real images.</p>
        </div>
        <div className="gallery-guide-grid">
          {galleryGuide.map(([title, body], index) => (
            <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{body}</p></article>
          ))}
        </div>
      </section>

      <section className="gallery-section section-pad section-warm">
        <div className="gallery-toolbar" aria-label="Gallery filters">
          {categories.map((item) => (
            <button type="button" className={category === item ? "active" : ""} key={item} onClick={() => setCategory(item)}>
              {item}
              <span>{item === "All" ? content.galleryItems.length : content.galleryItems.filter((entry) => entry.category === item).length}</span>
            </button>
          ))}
        </div>

        <div className="gallery-grid textile-gallery-grid">
          {visibleItems.map((item, index) => (
            <article className={`gallery-card gallery-card-${(index % 5) + 1}`} key={item.id}>
              <div className={`gallery-visual ${item.imageUrl ? "has-image" : "is-placeholder"}`}>
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.title} loading="lazy" decoding="async" />
                ) : (
                  <div className="gallery-placeholder" aria-hidden="true"><strong>{item.category}</strong><span>Photo ready</span></div>
                )}
                <span className="gallery-category">{item.category}</span>
              </div>
              <div className="gallery-card-copy">
                <p className="eyebrow">{item.company}</p>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
        {!visibleItems.length && <p className="gallery-empty">No gallery entries are published in this category yet.</p>}
      </section>

      <section className="gallery-story-band section-dark section-pad textile-gallery-story">
        <div><p className="eyebrow light">Private CMS</p><h2>Your team controls these images without touching the code.</h2></div>
        <p>Sign in through the private admin to upload persistent photos, set the homepage hero, add gallery entries, choose categories, edit captions and descriptions, reorder media or replace a file without changing its public URL.</p>
        <Link className="button ghost" to="/process">See the operating process</Link>
      </section>

      <section className="contact-band textile-contact-band">
        <div><p className="eyebrow">Wholesale enquiries</p><h2>See something relevant to your market? Ask about the category and current availability.</h2></div>
        <Link className="button light" to="/contact?type=product">Contact SAMWATEX</Link>
      </section>
    </div>
  );
}
