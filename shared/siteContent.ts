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

export type StatItem = {
  value: string;
  label: string;
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
  statsTitle: string;
  stats: StatItem[];
  contactEmail: string;
  contactPhone: string;
  whatsappPhone: string;
  contactAddress: string;
  footerText: string;
  seoTitle: string;
  seoDescription: string;
  seoSocialImageUrl: string;
};

export const defaultSiteContent: SiteContent = {
  brandName: "SAMWATEX",
  brandDescriptor: "International Group",
  heroEyebrow: "Beirut, Lebanon · Trade & Export",
  heroTitle: "Trade from Lebanon, built around the market.",
  heroSubtitle:
    "SAMWATEX works with suppliers, customers and distributors to source products, coordinate exports and support market supply across Africa, the Middle East and selected international markets.",
  heroImageUrl: "",
  aboutTitle: "A commercial group with Lebanon at the center.",
  aboutBody:
    "SAMWATEX operates from Lebanon through close supplier and customer relationships. We source, trade and coordinate export supply for markets where consistency, speed and practical execution matter.",
  capabilitiesTitle: "From requirement to market supply.",
  capabilities: [
    {
      eyebrow: "01",
      title: "International Trade & Export",
      description:
        "We coordinate commercial requirements, supply and export movement from Lebanon into the markets we serve.",
    },
    {
      eyebrow: "02",
      title: "Sourcing & Supply",
      description:
        "We work with suppliers to match products, quantities and timing to customer requirements and market demand.",
    },
    {
      eyebrow: "03",
      title: "Distribution Partnerships",
      description:
        "We build market relationships with customers and distributors who need dependable continuity of supply.",
    },
  ],
  companiesTitle: "HMD International Group, under SAMWATEX.",
  companies: [
    {
      slug: "hmd-international-group",
      name: "HMD International Group",
      shortName: "HMD",
      relationship: "A SAMWATEX Company",
      tagline: "Trading, sourcing and market supply.",
      description:
        "HMD International Group is the operating company within SAMWATEX focused on trading, product sourcing, distribution and market fulfilment.",
      overview:
        "HMD International Group operates within SAMWATEX as the market-facing trading company. It works across sourcing, product supply, distribution and export coordination, with a focus on practical execution and long-term customer relationships.",
      focusAreas: [
        "International trading and supply",
        "Textiles, apparel and general merchandise",
        "Distribution and market fulfilment",
        "Commercial sourcing and partner coordination",
      ],
      markets: ["Africa", "Middle East", "Selected international markets"],
    },
  ],
  industriesTitle: "Products and commercial categories we work with.",
  industries: [
    {
      slug: "textiles-apparel",
      eyebrow: "01",
      title: "Textiles & Apparel",
      description:
        "Sourcing and supply across textile and apparel categories according to customer requirements and market demand.",
      highlights: ["Sourcing", "Trade coordination", "Market supply"],
      companySlugs: ["hmd-international-group"],
    },
    {
      slug: "general-merchandise",
      eyebrow: "02",
      title: "General Merchandise",
      description:
        "Selected consumer and commercial product lines sourced and supplied around availability, specification and target-market needs.",
      highlights: ["Multi-category sourcing", "Export coordination", "Commercial supply"],
      companySlugs: ["hmd-international-group"],
    },
    {
      slug: "international-trade",
      eyebrow: "03",
      title: "International Trade",
      description:
        "Commercial coordination between suppliers, customers and export markets from SAMWATEX's operating base in Lebanon.",
      highlights: ["Export", "Supplier relationships", "Commercial coordination"],
      companySlugs: ["hmd-international-group"],
    },
    {
      slug: "distribution-fulfilment",
      eyebrow: "04",
      title: "Distribution & Fulfilment",
      description:
        "Coordination of supply and market fulfilment so products move from source to customer with clear commercial accountability.",
      highlights: ["Distribution", "Inventory movement", "Market fulfilment"],
      companySlugs: ["hmd-international-group"],
    },
  ],
  productCollections: [
    {
      title: "Textile & apparel products",
      description:
        "Textile and apparel supply selected around customer specifications, seasonality, destination market and available sourcing.",
      examples: ["Apparel", "Textile goods", "Seasonal product lines"],
    },
    {
      title: "General merchandise",
      description:
        "Consumer and commercial goods sourced according to market requirements, supplier availability and shipment economics.",
      examples: ["Consumer goods", "Commercial stock lines", "Market-specific assortments"],
    },
    {
      title: "Commercial sourcing",
      description:
        "Product sourcing matched to customer demand, destination-market requirements and practical fulfilment conditions.",
      examples: ["Supplier sourcing", "Product matching", "Export-ready supply"],
    },
  ],
  marketsTitle: "From Lebanon to the markets we serve.",
  markets: [
    {
      region: "Africa",
      description: "Export relationships and customer supply across selected African markets.",
    },
    {
      region: "Middle East",
      description: "Regional trade and supply coordinated from Lebanon.",
    },
    {
      region: "International Markets",
      description: "Selected opportunities outside the core regions where the product, partner and commercial terms make sense.",
    },
  ],
  galleryTitle: "Products, operations and the work behind the group.",
  galleryItems: [
    {
      id: "samwatex-group",
      category: "SAMWATEX",
      company: "SAMWATEX",
      title: "The group from Lebanon.",
      description: "SAMWATEX coordinates its commercial activity and export relationships from Lebanon.",
      imageUrl: "",
    },
    {
      id: "hmd-operating-company",
      category: "HMD",
      company: "HMD International Group",
      title: "HMD International Group.",
      description: "The operating company focused on trading, sourcing, distribution and market supply.",
      imageUrl: "",
    },
    {
      id: "international-movement",
      category: "Trade & Export",
      company: "SAMWATEX",
      title: "International movement.",
      description: "Export coordination linking product requirements, supply and destination markets.",
      imageUrl: "",
    },
    {
      id: "textile-apparel",
      category: "Products",
      company: "HMD International Group",
      title: "Textiles and apparel.",
      description: "Commercial textile and apparel categories sourced around market requirements.",
      imageUrl: "",
    },
    {
      id: "general-merchandise",
      category: "Products",
      company: "HMD International Group",
      title: "General merchandise.",
      description: "Selected product lines sourced and supplied according to customer and market needs.",
      imageUrl: "",
    },
    {
      id: "partner-coordination",
      category: "Operations",
      company: "SAMWATEX",
      title: "Supplier and customer coordination.",
      description: "The commercial relationships that keep sourcing, supply and export execution moving.",
      imageUrl: "",
    },
  ],
  statsTitle: "The group in four lines.",
  stats: [
    { value: "Lebanon", label: "Operating base" },
    { value: "Africa", label: "Core export region" },
    { value: "Middle East", label: "Regional market" },
    { value: "HMD", label: "Operating company" },
  ],
  contactEmail: "sales@samwatex.com",
  contactPhone: "+96181333194",
  whatsappPhone: "",
  contactAddress: "Beirut Port Free Zone, Ezzeldine Building, Floor (-1), Hadath San Therez, Baabda, Lebanon",
  footerText: "SAMWATEX. All rights reserved.",
  seoTitle: "SAMWATEX — International Trade & Export Group",
  seoDescription:
    "SAMWATEX is a Lebanon-based group working across sourcing, trade and export supply for markets in Africa, the Middle East and selected international destinations.",
  seoSocialImageUrl: "",
};

export function normalizeSiteContent(value: unknown): SiteContent {
  if (!value || typeof value !== "object") return structuredClone(defaultSiteContent);
  const input = value as Partial<SiteContent> & { businesses?: Capability[]; locations?: unknown[] };

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
    stats: Array.isArray(input.stats) ? input.stats : structuredClone(defaultSiteContent.stats),
  };
}
