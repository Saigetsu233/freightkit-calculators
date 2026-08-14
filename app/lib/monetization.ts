export const product = {
  name: "ShipMathLab Operations Workbook",
  price: 19,
  checkoutUrl: process.env.NEXT_PUBLIC_PRODUCT_URL || null,
};

export const resourcePartners = [
  {
    name: "Shipping software",
    description: "Compare multi-carrier tools for labels, rate shopping, and shipment records.",
    url: process.env.NEXT_PUBLIC_AFFILIATE_SHIPPING_SOFTWARE_URL || null,
    bestFor: ["shipping-cost-estimator", "dimensional-weight-calculator", "package-girth-calculator"],
  },
  {
    name: "Packaging supplies",
    description: "Source cartons, void fill, tape, pallet protection, and packing-room consumables.",
    url: process.env.NEXT_PUBLIC_AFFILIATE_PACKAGING_SUPPLIES_URL || null,
    bestFor: ["carton-fit-calculator", "corrugated-box-cost-calculator", "packaging-waste-calculator"],
  },
  {
    name: "Warehouse scales",
    description: "Review parcel and platform scales suitable for repeatable outbound measurements.",
    url: process.env.NEXT_PUBLIC_AFFILIATE_SCALES_URL || null,
    bestFor: ["freight-density-calculator", "air-freight-chargeable-weight-calculator", "pallet-load-calculator"],
  },
];

export function getPartnerForTool(toolSlug: string) {
  return resourcePartners.find((partner) => partner.bestFor.includes(toolSlug));
}
