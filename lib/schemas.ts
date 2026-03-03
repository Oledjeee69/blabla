import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Минимум 3 символа"),
  type: z.enum(["product", "service"]).default("product"),
  description_short: z
    .string()
    .min(10, "Кратко опишите товар (минимум 10 символов)"),
  description_long: z
    .string()
    .min(10, "Подробно опишите товар (минимум 10 символов)"),
  code: z.string().min(1, "Укажите артикул"),
  unit: z.coerce.number().int().positive(),
  category: z.coerce.number().int().positive(),
  cashback_type: z.string().default("lcard_cashback"),
  seo_title: z.string().optional(),
  seo_description: z.string().optional(),
  seo_keywords: z.array(z.string()).optional(),
  global_category_id: z.coerce.number().int().positive().optional(),
  marketplace_price: z.coerce.number().nonnegative(),
  chatting_percent: z.coerce.number().min(0).max(100),
  address: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional()
});

export type ProductFormValues = z.infer<typeof productSchema>;

