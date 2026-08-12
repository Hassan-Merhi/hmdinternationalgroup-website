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
  name: string;
  relationship: string;
  description: string;
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
  marketsTitle: string;
  markets: MarketItem[];
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
      name: "HMD International Group",
      relationship: "A SAMWATEX Company",
      description:
        "An operating company within the SAMWATEX group, supporting the group’s commercial activities and market relationships.",
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
    companies: Array.isArray(input.companies) ? input.companies : structuredClone(defaultSiteContent.companies),
    markets: Array.isArray(input.markets) ? input.markets : structuredClone(defaultSiteContent.markets),
  };
}
