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
  brandDescriptor: "Textile Recovery & Export",
  heroEyebrow: "Lebanon · Sorting, grading & export",
  heroTitle: "Used clothing, prepared for the markets that need it.",
  heroSubtitle:
    "SAMWATEX sorts, grades, prepares and exports reusable clothing, footwear and textile goods from Lebanon for wholesale customers across Africa and the Middle East.",
  heroImageUrl: "",
  aboutTitle: "Giving reusable textiles a second commercial life.",
  aboutBody:
    "From our Lebanon base, SAMWATEX turns mixed used-clothing supply into clear, market-ready wholesale assortments. Our work brings sorting, grading, quality control, baling and export coordination together so buyers receive goods prepared for the realities of their destination market.",
  capabilitiesTitle: "From mixed textile supply to export-ready bales.",
  capabilities: [
    {
      eyebrow: "01",
      title: "Intake & Preparation",
      description:
        "Incoming used clothing and textile goods are received, opened and prepared for systematic sorting and evaluation.",
    },
    {
      eyebrow: "02",
      title: "Sorting",
      description:
        "Items are separated by category, season, garment type and practical market relevance before grading begins.",
    },
    {
      eyebrow: "03",
      title: "Grading & Quality Control",
      description:
        "Goods are assessed by condition and quality so wholesale assortments can be built around clear buyer expectations.",
    },
    {
      eyebrow: "04",
      title: "Baling & Preparation",
      description:
        "Finished assortments are compressed, identified and prepared for efficient warehouse handling and container loading.",
    },
    {
      eyebrow: "05",
      title: "Wholesale Export",
      description:
        "Orders are coordinated from Lebanon for shipment to wholesale customers across Africa, the Middle East and selected markets.",
    },
  ],
  companiesTitle: "HMD International Group operates under SAMWATEX.",
  companies: [
    {
      slug: "hmd-international-group",
      name: "HMD International Group",
      shortName: "HMD",
      relationship: "A SAMWATEX Company",
      tagline: "Textile trading, market supply and export execution.",
      description:
        "HMD International Group is the operating company within SAMWATEX focused on used-clothing trade, wholesale customer supply and export-market execution.",
      overview:
        "HMD International Group operates within SAMWATEX as the market-facing commercial company. It connects the group's sorting and product preparation capabilities with wholesale buyers, destination-market requirements and export execution.",
      focusAreas: [
        "Used clothing and textile wholesale",
        "Buyer-specific assortments and market supply",
        "Commercial trading and customer relationships",
        "Export coordination from Lebanon",
      ],
      markets: ["Africa", "Middle East", "Selected international markets"],
    },
  ],
  industriesTitle: "Wholesale categories built around buyer demand.",
  industries: [
    {
      slug: "mens-clothing",
      eyebrow: "01",
      title: "Men's Clothing",
      description:
        "Wholesale assortments across everyday, seasonal and outerwear categories prepared to buyer and destination requirements.",
      highlights: ["Shirts & tops", "Trousers & denim", "Jackets & outerwear"],
      companySlugs: ["hmd-international-group"],
    },
    {
      slug: "womens-clothing",
      eyebrow: "02",
      title: "Women's Clothing",
      description:
        "Mixed and category-led women's apparel sorted for condition, seasonality and the preferences of the destination market.",
      highlights: ["Dresses & skirts", "Tops & blouses", "Trousers & outerwear"],
      companySlugs: ["hmd-international-group"],
    },
    {
      slug: "childrens-clothing",
      eyebrow: "03",
      title: "Children's Clothing",
      description:
        "Children's garments prepared by useful category and season, with assortments designed for wholesale resale markets.",
      highlights: ["Boys", "Girls", "Seasonal mixes"],
      companySlugs: ["hmd-international-group"],
    },
    {
      slug: "shoes-footwear",
      eyebrow: "04",
      title: "Shoes & Footwear",
      description:
        "Used footwear separated by type and condition for wholesale assortments and destination-market demand.",
      highlights: ["Men", "Women", "Children"],
      companySlugs: ["hmd-international-group"],
    },
    {
      slug: "bags-accessories",
      eyebrow: "05",
      title: "Bags & Accessories",
      description:
        "Selected accessories and bags prepared as standalone or complementary wholesale categories.",
      highlights: ["Handbags", "Backpacks", "Belts & accessories"],
      companySlugs: ["hmd-international-group"],
    },
    {
      slug: "household-textiles",
      eyebrow: "06",
      title: "Household Textiles",
      description:
        "Reusable household textile lines sorted and prepared according to available supply and buyer requirements.",
      highlights: ["Bed linen", "Blankets", "Towels & household mixes"],
      companySlugs: ["hmd-international-group"],
    },
  ],
  productCollections: [
    {
      title: "Men's assortments",
      description:
        "Men's used clothing prepared by garment family, season and condition for wholesale markets.",
      examples: ["Shirts & T-shirts", "Jeans & trousers", "Jackets & coats", "Sportswear"],
    },
    {
      title: "Women's assortments",
      description:
        "Women's apparel sorted into useful wholesale groupings instead of undifferentiated mixed stock.",
      examples: ["Dresses", "Blouses & tops", "Skirts & trousers", "Jackets & outerwear"],
    },
    {
      title: "Children's assortments",
      description:
        "Children's clothing prepared by practical age, season and category combinations for resale markets.",
      examples: ["Boys' clothing", "Girls' clothing", "Summer mixes", "Winter mixes"],
    },
    {
      title: "Shoes & footwear",
      description:
        "Used footwear separated by wearer, type and usable condition for wholesale supply.",
      examples: ["Men's shoes", "Women's shoes", "Children's shoes", "Sport & casual footwear"],
    },
    {
      title: "Bags & accessories",
      description:
        "Accessory categories selected from available supply and prepared for market-specific wholesale demand.",
      examples: ["Handbags", "School bags", "Belts", "Wallets & mixed accessories"],
    },
    {
      title: "Household textiles",
      description:
        "Reusable household textile goods prepared as separate categories where supply and quality allow.",
      examples: ["Bed linen", "Blankets", "Towels", "Household textile mixes"],
    },
    {
      title: "Buyer-specific mixes",
      description:
        "Mixed bales and tailored assortments can be discussed around destination, season, category preference and available supply.",
      examples: ["Summer mixes", "Winter mixes", "Category mixes", "Market-specific assortments"],
    },
  ],
  marketsTitle: "Wholesale textile exports from Lebanon.",
  markets: [
    {
      region: "Africa",
      description: "Core wholesale export relationships across selected African markets, served from Lebanon.",
    },
    {
      region: "Middle East",
      description: "Regional used-clothing and textile trade coordinated through SAMWATEX and HMD.",
    },
    {
      region: "Selected Markets",
      description: "Additional destinations considered where product mix, demand and commercial terms align.",
    },
  ],
  galleryTitle: "The work behind every shipment.",
  galleryItems: [
    {
      id: "samwatex-group",
      category: "SAMWATEX",
      company: "SAMWATEX",
      title: "Textile recovery from Lebanon.",
      description: "SAMWATEX brings used-clothing preparation, wholesale trade and export coordination together from Lebanon.",
      imageUrl: "",
    },
    {
      id: "hmd-operating-company",
      category: "HMD",
      company: "HMD International Group",
      title: "Market-facing wholesale execution.",
      description: "HMD connects product preparation with buyer requirements and export-market relationships.",
      imageUrl: "",
    },
    {
      id: "international-movement",
      category: "Export",
      company: "SAMWATEX",
      title: "Prepared for container movement.",
      description: "Baled assortments are organized for handling, loading and international shipment.",
      imageUrl: "",
    },
    {
      id: "textile-apparel",
      category: "Products",
      company: "HMD International Group",
      title: "Sorted clothing categories.",
      description: "Men's, women's and children's clothing separated into practical wholesale assortments.",
      imageUrl: "",
    },
    {
      id: "general-merchandise",
      category: "Products",
      company: "HMD International Group",
      title: "Footwear, bags and household textiles.",
      description: "Complementary reusable-goods categories prepared around condition, supply and buyer demand.",
      imageUrl: "",
    },
    {
      id: "partner-coordination",
      category: "Operations",
      company: "SAMWATEX",
      title: "From sorting floor to buyer specification.",
      description: "Commercial decisions stay connected to the categories, grades and markets the goods are being prepared for.",
      imageUrl: "",
    },
  ],
  statsTitle: "One operation, five connected steps.",
  stats: [
    { value: "Sort", label: "Separate by useful category" },
    { value: "Grade", label: "Evaluate condition and quality" },
    { value: "Build", label: "Prepare buyer-ready assortments" },
    { value: "Bale", label: "Compress and identify shipments" },
    { value: "Export", label: "Move wholesale orders from Lebanon" },
  ],
  contactEmail: "sales@samwatex.com",
  contactPhone: "+96181333194",
  whatsappPhone: "",
  contactAddress: "Beirut Port Free Zone, Ezzeldine Building, Floor (-1), Hadath San Therez, Baabda, Lebanon",
  footerText: "SAMWATEX. All rights reserved.",
  seoTitle: "SAMWATEX — Used Clothing Sorting, Grading & Export",
  seoDescription:
    "SAMWATEX is a Lebanon-based used-clothing and textile business focused on sorting, grading, baling and wholesale export to markets across Africa and the Middle East.",
  seoSocialImageUrl: "",
};

function preserveMedia(defaultItems: GalleryItem[], incoming: GalleryItem[] | undefined) {
  if (!Array.isArray(incoming)) return defaultItems;
  const mediaById = new Map(incoming.map((item) => [item.id, item.imageUrl]));
  return defaultItems.map((item, index) => ({
    ...item,
    imageUrl: mediaById.get(item.id) || incoming[index]?.imageUrl || item.imageUrl,
  }));
}

export function normalizeSiteContent(value: unknown): SiteContent {
  if (!value || typeof value !== "object") return structuredClone(defaultSiteContent);
  const input = value as Partial<SiteContent> & { businesses?: Capability[]; locations?: unknown[] };

  if (input.brandName === "HMD International Group") {
    return {
      ...structuredClone(defaultSiteContent),
      heroImageUrl: typeof input.heroImageUrl === "string" ? input.heroImageUrl : "",
    };
  }

  const previousGenericSamwatex =
    input.heroTitle === "Trade from Lebanon, built around the market."
    || input.capabilities?.some((capability) => capability?.title === "International Trade & Export")
    || input.industries?.some((industry) => industry?.slug === "general-merchandise");

  if (previousGenericSamwatex) {
    const migrated = structuredClone(defaultSiteContent);
    if (typeof input.heroImageUrl === "string") migrated.heroImageUrl = input.heroImageUrl;
    if (typeof input.seoSocialImageUrl === "string") migrated.seoSocialImageUrl = input.seoSocialImageUrl;
    if (typeof input.contactEmail === "string") migrated.contactEmail = input.contactEmail;
    if (typeof input.contactPhone === "string") migrated.contactPhone = input.contactPhone;
    if (typeof input.whatsappPhone === "string") migrated.whatsappPhone = input.whatsappPhone;
    if (typeof input.contactAddress === "string") migrated.contactAddress = input.contactAddress;
    migrated.galleryItems = preserveMedia(migrated.galleryItems, input.galleryItems);
    return migrated;
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
