import { z } from "zod";

const sourceStatus = z.enum(["verified", "unverified"]);

const specificationSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  value: z.string().min(1),
  sourceStatus,
});

const featureSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

const compatibilitySchema = z.object({
  type: z.enum(["pod", "coil", "cartridge", "charging"]),
  label: z.string().min(1),
  note: z.string().optional(),
});

const assetSchema = z.object({
  kind: z.enum(["official-photo", "illustration"]),
  role: z.enum(["card", "detail"]),
  src: z.string().min(1),
  alt: z.string().min(1),
  angle: z.string().optional(),
  transparentBackground: z.boolean().optional(),
  sourceName: z.string().optional(),
  sourceUrl: z.string().optional(),
});

const faqItemSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const productSchema = z.object({
  id: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  brandId: z.string().min(1),
  familyId: z.string().min(1),
  categoryId: z.string().min(1),
  systemType: z.enum(["open-pod", "pod-kit", "disposable", "pod-cartridge", "coil", "accessory", "e-liquid"]),
  name: z.string().min(1),
  displayName: z.string().min(1),
  tagline: z.string().min(1),
  shortDescription: z.string().min(1),
  isFlagship: z.boolean(),
  editorialTag: z.string().optional(),
  attributes: z.object({
    batteryMah: z.number().positive().optional(),
    wattageMin: z.number().positive().optional(),
    wattageMax: z.number().positive().optional(),
    puffCount: z.number().positive().optional(),
    capacityMl: z.number().positive().optional(),
    screenType: z.enum(["none", "led-indicator", "color-display", "touchscreen"]).optional(),
    screenSize: z.string().optional(),
    drawStyle: z.enum(["MTL", "RDL", "DTL", "MTL/RDL"]).optional(),
    portability: z.enum(["ultra-compact", "compact", "standard"]).optional(),
    beginnerFriendly: z.boolean(),
    chargingType: z.string().min(1).optional(),
    weightG: z.number().positive().optional(),
    dimensions: z.string().optional(),
    nicotineMg: z.number().positive().optional(),
    liquidBase: z.enum(["salt-nic", "freebase"]).optional(),
  }),
  assets: z.array(assetSchema),
  specifications: z.array(specificationSchema).min(1),
  features: z.array(featureSchema),
  compatibility: z.array(compatibilitySchema),
  whoIsThisFor: z.array(z.string().min(1)).min(1),
  faqs: z.array(faqItemSchema),
  relatedProductSlugs: z.array(z.string()),
  sourceUrls: z.array(z.string()).min(1),
});

export const productListSchema = z.array(productSchema);
