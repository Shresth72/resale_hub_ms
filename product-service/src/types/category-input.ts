import { z } from "zod";

export const CategoryInput = z.object({
  name: z.string().min(3).max(128),
  parentId: z.string().optional(),
  displayOrder: z.number()
  //   imageUrl: z.string()
});

export const NewCategoryInput = z.object({
  name: z.string().min(3).max(128),
  parentId: z.string().optional()
});

export const AddItemInput = z.object({
  id: z.string(),
  products: z.array(z.string())
});

export type CategoryInputType = z.infer<typeof CategoryInput>;
export type NewCategoryInputType = z.infer<typeof NewCategoryInput>;
export type AddItemInputType = z.infer<typeof AddItemInput>;
