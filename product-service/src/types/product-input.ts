import { z } from "zod";

export const ProductInput = z.object({
  name: z.string().min(3).max(128),
  description: z.string().min(3).max(255),
  category_id: z.string(),
  image_url: z.string().url(),
  price: z.number(),
  availability: z.boolean()
});


export type ProductInputType = z.infer<typeof ProductInput>;
