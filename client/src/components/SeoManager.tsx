import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import type { SiteContent } from "@shared/siteContent";

const baseUrl = "https://samwatex.com";

function upsertMeta(attribute: "name" | "property", key: string, value: string) {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = value;
}

function removeMeta(attribute: "name" | "property", key: string) {
  document.head.querySelector(`meta[${attribute}="${key}"]`)?.remove();
}

function upsertCanonical(href: string) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
}

function pageSeo(pathname: string, content: SiteContent) {
  const companySlug = pathname.startsWith("/companies/") ? pathname.split("/")[2] : "";
  const company = companySlug ? content.companies.find((item) => item.slug === companySlug) : undefined;
  if (company) {
    return {
      title: `${company.name} — A ${content.brandName} Company`,
      description: company.description,
      known: true,
      crumbs: ["Companies", company.name],
    };
  }

  const routes: Record<string, { title: string; description: string; crumbs?: string[] }> = {
    "/": { title: content.seoTitle, description: content.seoDescription },
    "/about": {
      title: `About ${content.brandName} — Used Clothing & Textile Export`,
      description: "Learn how SAMWATEX prepares reusable clothing and textile goods in Lebanon through sorting, grading, baling and wholesale export.",
      crumbs: ["About"],
    },
    "/what-we-do": {
      title: `What We Do — Sorting, Grading & Export | ${content.brandName}`,
      description: "SAMWATEX receives, sorts, grades, prepares and exports used clothing and textile goods for wholesale markets from Lebanon.",
      crumbs: ["What We Do"],
    },
    "/products": {
      title: `Wholesale Used Clothing Products — ${content.brandName}`,
      description: "Explore wholesale men's, women's and children's used clothing, footwear, bags, accessories and household textile categories prepared by SAMWATEX.",
      crumbs: ["Products"],
    },
    "/process": {
      title: `Used Clothing Sorting & Grading Process — ${content.brandName}`,
      description: "See the SAMWATEX process from incoming used clothing through sorting, grading, market-mix preparation, baling and export from Lebanon.",
      crumbs: ["Process"],
    },
    "/export-markets": {
      title: `Used Clothing Export Markets — ${content.brandName}`,
      description: "SAMWATEX is based in Lebanon and supplies wholesale used clothing and textile export relationships across Africa, the Middle East and selected markets.",
      crumbs: ["Export Markets"],
    },
    "/gallery": {
      title: `Gallery — ${content.brandName}`,
      description: "Explore SAMWATEX operations, sorted textile categories, baling, HMD International Group and export preparation from Lebanon.",
      crumbs: ["Gallery"],
    },
    "/contact": {
      title: `Contact ${content.brandName} — Wholesale Used Clothing Enquiries`,
      description: "Contact SAMWATEX in Lebanon for wholesale used clothing, textile category, export, supplier and HMD International Group enquiries.",
      crumbs: ["Contact"],
    },
  };
  const found = routes[pathname];
  return found ? { ...found, known: true } : { title: `Page Not Found — ${content.brandName}`, description: "The requested SAMWATEX page could not be found.", known: false, crumbs: [] as string[] };
}

export function SeoManager({ content }: { content: SiteContent }) {
  const location = useLocation();

  useEffect(() => {
    const seo = pageSeo(location.pathname, content);
    const crumbs = seo.crumbs ?? [];
    const canonicalPath = location.pathname === "/" ? "/" : location.pathname.replace(/\/$/, "");
    const canonical = `${baseUrl}${canonicalPath}`;
    const socialImage = content.seoSocialImageUrl || content.heroImageUrl;
    const absoluteImage = socialImage ? new URL(socialImage, baseUrl).toString() : "";

    document.title = seo.title;
    upsertCanonical(canonical);
    upsertMeta("name", "description", seo.description);
    upsertMeta("name", "robots", seo.known ? "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" : "noindex,nofollow");
    upsertMeta("property", "og:title", seo.title);
    upsertMeta("property", "og:description", seo.description);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:url", canonical);
    upsertMeta("property", "og:site_name", content.brandName);
    upsertMeta("property", "og:locale", "en_US");
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", seo.title);
    upsertMeta("name", "twitter:description", seo.description);
    if (absoluteImage) {
      upsertMeta("property", "og:image", absoluteImage);
      upsertMeta("name", "twitter:image", absoluteImage);
    } else {
      removeMeta("property", "og:image");
      removeMeta("name", "twitter:image");
    }

    const organizationId = `${baseUrl}/#organization`;
    const websiteId = `${baseUrl}/#website`;
    const graph: Record<string, unknown>[] = [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: content.brandName,
        url: baseUrl,
        email: content.contactEmail,
        telephone: content.contactPhone,
        description: content.seoDescription,
        address: {
          "@type": "PostalAddress",
          streetAddress: content.contactAddress,
          addressCountry: "LB",
        },
        areaServed: content.markets.map((market) => market.region),
        subOrganization: content.companies.map((company) => ({
          "@type": "Organization",
          "@id": `${baseUrl}/companies/${company.slug}#organization`,
          name: company.name,
          url: `${baseUrl}/companies/${company.slug}`,
          description: company.description,
          parentOrganization: { "@id": organizationId },
        })),
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: baseUrl,
        name: content.brandName,
        publisher: { "@id": organizationId },
        inLanguage: "en",
      },
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        url: canonical,
        name: seo.title,
        description: seo.description,
        isPartOf: { "@id": websiteId },
        about: { "@id": organizationId },
        inLanguage: "en",
      },
    ];

    if (crumbs.length) {
      const items = [{ name: "Home", url: baseUrl }];
      let current = "";
      for (const crumb of crumbs) {
        const segment = crumb.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        current += `/${segment}`;
        items.push({ name: crumb, url: `${baseUrl}${current}` });
      }
      graph.push({
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: item.url })),
      });
    }

    let script = document.head.querySelector<HTMLScriptElement>("#samwatex-structured-data");
    if (!script) {
      script = document.createElement("script");
      script.id = "samwatex-structured-data";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
  }, [content, location.pathname]);

  return null;
}
