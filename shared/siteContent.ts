export type BusinessArea = {
  title: string;
  description: string;
  eyebrow: string;
};

export type LocationItem = {
  city: string;
  country: string;
  description: string;
};

export type SiteContent = {
  brandName: string;
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  aboutTitle: string;
  aboutBody: string;
  businessesTitle: string;
  businesses: BusinessArea[];
  locationsTitle: string;
  locations: LocationItem[];
  contactEmail: string;
  contactPhone: string;
  whatsappPhone: string;
  footerText: string;
};

export const defaultSiteContent: SiteContent = {
  brandName: "HMD International Group",
  heroEyebrow: "Trade • Industry • Distribution",
  heroTitle: "Built for movement. Structured for growth.",
  heroSubtitle:
    "HMD International Group connects products, operations and markets through a growing network in the Democratic Republic of the Congo.",
  heroImageUrl: "",
  aboutTitle: "A group built around dependable execution.",
  aboutBody:
    "Our operations are shaped around practical market needs: reliable sourcing, disciplined inventory movement, industrial operations and strong local distribution. This first version of the site is intentionally content-ready, so photography, milestones and company-specific details can be added from the admin area as the public brand is developed.",
  businessesTitle: "What we do",
  businesses: [
    {
      eyebrow: "01",
      title: "Trading & Supply",
      description:
        "Coordinated sourcing, containerized imports and commercial supply across a growing operating network.",
    },
    {
      eyebrow: "02",
      title: "Manufacturing & Processing",
      description:
        "Operational workflows designed around production visibility, material control and consistent execution.",
    },
    {
      eyebrow: "03",
      title: "Distribution & Logistics",
      description:
        "Inventory and movement across locations with an emphasis on traceability, availability and delivery discipline.",
    },
  ],
  locationsTitle: "Operating close to the market",
  locations: [
    {
      city: "Lubumbashi",
      country: "DR Congo",
      description: "A core operating base for the group and its commercial activities.",
    },
    {
      city: "Kolwezi",
      country: "DR Congo",
      description: "Supporting distribution and market reach in the Copperbelt region.",
    },
    {
      city: "Kinshasa",
      country: "DR Congo",
      description: "Extending the group’s reach into the country’s largest commercial market.",
    },
  ],
  contactEmail: "info@hmdinternationalgroup.com",
  contactPhone: "",
  whatsappPhone: "",
  footerText: "HMD International Group. All rights reserved.",
};
