export type Capability = {
  title: string;
  description: string;
  eyebrow: string;
};

export type MarketItem = {
  region: string;
  description: string;
};

export type CompanyItem = {
  slug: string;
  name: string;
  shortName: string;
  relationship: string;
  tagline: string;
  description: string;
  overview: string;
  focusAreas: string[];
  markets: string[];
};

export type IndustryItem = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  companySlugs: string[];
};

export type ProductCollection = {
  title: string;
  description: string;
  examples: string[];
};

export type GalleryItem = {
  id: string;
  category: string;
  company: string;
  title: string;
  description: string;
  imageUrl: string;
};

export type SiteContent = {
  brandName: string;
  brandDescriptor: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  aboutTitle: string;
  aboutBody: string;
  capabilitiesTitle: string;
  capabilities: Capability[];
  companiesTitle: string;
  companies: CompanyItem[];
  industriesTitle: string;
  industries: IndustryItem[];
  productCollections: ProductCollection[];
  marketsTitle: string;
  markets: MarketItem[];
  galleryTitle: string;
  galleryItems: GalleryItem[];
  contactEmail: string;
  contactPhone: string;
  whatsappPhone: string;
  contactAddress: string;
  footerText: string;
};

export const defaultSiteContent: SiteContent = {
  brandName: "SAMWATEX",
  brandDescriptor: "International Group",
  heroEyebrow: "Lebanon • International Trade • Export",
  heroTitle: "From Lebanon to markets that move.",
  heroSubtitle:
    "SAMWATEX is a Lebanon-based group connecting sourcing, trade and export opportunities with customers across Africa, the Middle East and international markets.",
  heroImageUrl: "",
  aboutTitle: "A focused group built for international trade.",
  aboutBody:
    "SAMWATEX brings together commercial relationships, sourcing capability and export execution from its base in Lebanon. The group is built around long-term partnerships, dependable movement of goods and a practical understanding of the markets it serves.",
  capabilitiesTitle: "Built around the movement of goods and opportunity.",
  capabilities: [
    {
      eyebrow: "01",
      title: "International Trade & Export",
      description:
        "Commercial coordination from Lebanon into established and developing markets across Africa, the Middle East and beyond.",
    },
    {
      eyebrow: "02",
      title: "Sourcing & Supply",
      description:
        "A relationship-led approach to sourcing products, aligning supply and supporting dependable fulfilment for customers and partners.",
    },
    {
      eyebrow: "03",
      title: "Distribution Partnerships",
      description:
        "Long-term market relationships designed to connect the right products with the right commercial channels.",
    },
  ],
  companiesTitle: "One group. Distinct operating companies.",
  companies: [
    {
      slug: "hmd-international-group",
      name: "HMD International Group",
      shortName: "HMD",
      relationship: "A SAMWATEX Company",
      tagline: "Commercial execution built close to the market.",
      description:
        "An operating company within the SAMWATEX group focused on trading, product movement and dependable market supply.",
      overview:
        "HMD International Group operates within the SAMWATEX portfolio as a commercially focused company supporting sourcing, trading, distribution and market fulfilment. Its role is practical: connect supply with demand, coordinate movement and build dependable customer relationships across the markets it serves.",
      focusAreas: [
        "International trading and supply",
        "Textiles, apparel and general merchandise",
        "Distribution and market fulfilment",
        "Commercial sourcing and partner coordination",
      ],
      markets: ["Africa", "Middle East", "Selected international markets"],
    },
  ],
  industriesTitle: "Commercial focus across products, trade and distribution.",
  industries: [
    {
      slug: "textiles-apparel",
      eyebrow: "01",
      title: "Textiles & Apparel",
      description:
        "A commercial category built around sourcing, trading and supplying textile and apparel products for market demand.",
      highlights: ["Sourcing", "Trade coordination", "Market supply"],
      companySlugs: ["hmd-international-group"],
    },
    {
      slug: "general-merchandise",
      eyebrow: "02",
      title: "General Merchandise",
      description:
        "Flexible product sourcing and supply across selected commercial categories where dependable availability and execution matter.",
      highlights: ["Multi-category sourcing", "Export coordination", "Commercial supply"],
      companySlugs: ["hmd-international-group"],
    },
    {
      slug: "international-trade",
      eyebrow: "03",
      title: "International Trade",
      description:
        "Cross-border commercial coordination connecting suppliers, customers and market opportunities from SAMWATEX's base in Lebanon.",
      highlights: ["Export", "Supplier relationships", "Commercial coordination"],
      companySlugs: ["hmd-international-group"],
    },
    {
      slug: "distribution-fulfilment",
      eyebrow: "04",
      title: "Distribution & Fulfilment",
      description:
        "The operating discipline behind getting products from source to market with visibility, consistency and dependable execution.",
      highlights: ["Distribution", "Inventory movement", "Market fulfilment"],
      companySlugs: ["hmd-international-group"],
    },
  ],
  productCollections: [
    {
      title: "Textile & apparel products",
      description:
        "A broad commercial portfolio serving textile and apparel demand, with exact product lines to be presented as the public catalog develops.",
      examples: ["Apparel", "Textile goods", "Seasonal product lines"],
    },
    {
      title: "General merchandise",
      description:
        "Selected consumer and commercial goods sourced according to market requirements and supply opportunities.",
      examples: ["Consumer goods", "Commercial stock lines", "Market-specific assortments"],
    },
    {
      title: "Commercial sourcing",
      description:
        "Partner-led sourcing for products and categories that fit customer demand, target markets and practical fulfilment requirements.",
      examples: ["Supplier sourcing", "Product matching", "Export-ready supply"],
    },
  ],
  marketsTitle: "Lebanon based. Internationally connected.",
  markets: [
    {
      region: "Africa",
      description: "Export relationships and commercial opportunities across African markets.",
    },
    {
      region: "Middle East",
      description: "Regional trade supported from SAMWATEX’s base in Lebanon.",
    },
    {
      region: "International Markets",
      description: "A flexible export platform built to pursue the right opportunities globally.",
    },
  ],
  galleryTitle: "The work, movement and companies behind the group.",
  galleryItems: [
    {
      id: "samwatex-group",
      category: "SAMWATEX",
      company: "SAMWATEX",
      title: "A group built from Lebanon outward.",
      description: "Corporate storytelling for the parent group, its commercial relationships and international outlook.",
      imageUrl: "",
    },
    {
      id: "hmd-operating-company",
      category: "HMD",
      company: "HMD International Group",
      title: "Commercial execution inside the group.",
      description: "The operating-company story behind sourcing, trading, distribution and market fulfilment.",
      imageUrl: "",
    },
    {
      id: "international-movement",
      category: "Trade & Export",
      company: "SAMWATEX",
      title: "From requirement to international movement.",
      description: "Visual space for future export, shipment and trade-coordination photography.",
      imageUrl: "",
    },
    {
      id: "textile-apparel",
      category: "Products",
      company: "HMD International Group",
      title: "Textiles and apparel for market demand.",
      description: "A flexible visual collection for apparel, textile goods and market-specific assortments.",
      imageUrl: "",
    },
    {
      id: "general-merchandise",
      category: "Products",
      company: "HMD International Group",
      title: "Selected general merchandise.",
      description: "Product storytelling designed to expand as exact public product lines and photography are added.",
      imageUrl: "",
    },
    {
      id: "partner-coordination",
      category: "Operations",
      company: "SAMWATEX",
      title: "Relationships behind dependable execution.",
      description: "A visual layer for sourcing, commercial coordination and the partners that connect supply with market opportunity.",
      imageUrl: "",
    },
  ],
  contactEmail: "sales@samwatex.com",
  contactPhone: "+96181333194",
  whatsappPhone: "",
  contactAddress: "Beirut Port Free Zone, Ezzeldine Building, Floor (-1), Hadath San Therez, Baabda, Lebanon",
  footerText: "SAMWATEX. All rights reserved.",
};

export function normalizeSiteContent(value: unknown): SiteContent {
  if (!value || typeof value !== "object") return structuredClone(defaultSiteContent);
  const input = value as Partial<SiteContent> & { businesses?: Capability[]; locations?: unknown[] };

  // The repository started as an HMD-only concept. Treat that initial payload as
  // legacy so a previously seeded database cannot override the SAMWATEX rebrand.
  if (input.brandName === "HMD International Group") {
    return {
      ...structuredClone(defaultSiteContent),
      heroImageUrl: typeof input.heroImageUrl === "string" ? input.heroImageUrl : "",
    };
  }

  return {
    ...structuredClone(defaultSiteContent),
    ...input,
    capabilities: Array.isArray(input.capabilities)
      ? input.capabilities
      : Array.isArray(input.businesses)
        ? input.businesses
        : structuredClone(defaultSiteContent.capabilities),
    companies: Array.isArray(input.companies) && input.companies.every((company) => company && typeof company === "object" && "slug" in company)
      ? input.companies
      : structuredClone(defaultSiteContent.companies),
    industries: Array.isArray(input.industries) ? input.industries : structuredClone(defaultSiteContent.industries),
    productCollections: Array.isArray(input.productCollections)
      ? input.productCollections
      : structuredClone(defaultSiteContent.productCollections),
    markets: Array.isArray(input.markets) ? input.markets : structuredClone(defaultSiteContent.markets),
    galleryItems: Array.isArray(input.galleryItems)
      ? input.galleryItems
      : structuredClone(defaultSiteContent.galleryItems),
  };
}
