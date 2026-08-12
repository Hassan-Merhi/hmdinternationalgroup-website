import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { SiteContent } from "@shared/siteContent";
import { defaultSiteContent } from "@shared/siteContent";
import { getSiteContent } from "@client/lib/api";

export function GalleryPage() {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    void getSiteContent().then(setContent);
  }, []);
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(content.galleryItems.map((item) => item.category)))],
    [content.galleryItems],
  );
  const visibleItems = category === "All"
    ? content.galleryItems
    : content.galleryItems.filter((item) => item.category === category);

  return (
    <div className="inner-page gallery-page">
      <section className="page-hero gallery-hero">
        <p className="eyebrow light">Gallery</p>
        <h1>The work, movement and companies behind SAMWATEX.</h1>
        <p className="page-hero-copy">
          A visual framework for the group, its operating companies, products and commercial activity. Final company photography can be added without changing the page structure.
        </p>
      </section>

      <section className="gallery-section section-pad">
        <div className="gallery-toolbar" aria-label="Gallery filters">
          {categories.map((item) => (
            <button
              type="button"
              className={category === item ? "active" : ""}
              key={item}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="gallery-grid">
          {visibleItems.map((item, index) => (
            <article className={`gallery-card gallery-card-${(index % 5) + 1}`} key={item.id}>
              <div
                className={`gallery-visual ${item.imageUrl ? "has-image" : ""}`}
                style={item.imageUrl ? { backgroundImage: `url(${item.imageUrl})` } : undefined}
              >
                <div className="gallery-visual-grid" aria-hidden="true" />
                <span className="gallery-code">SWX / {String(index + 1).padStart(2, "0")}</span>
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
      </section>

      <section className="gallery-story-band section-dark section-pad">
        <div>
          <p className="eyebrow light">Visual storytelling</p>
          <h2>Designed now. Ready for your real photography next.</h2>
        </div>
        <p>
          The gallery supports image URLs today and is structured for the later media manager, so photos can be uploaded, categorized and replaced without rebuilding the public experience.
        </p>
        <Link className="button ghost" to="/companies/hmd-international-group">Explore HMD</Link>
      </section>
    </div>
  );
}
