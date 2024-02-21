import { z } from "zod";

export const CartInput = z.object({
  qty: z.number(),
  productId: z.string()
});

export const UpdateCartInput = z.object({
  qty: z.number()
});

export type CartInputType = z.infer<typeof CartInput>;
export type UpdateCartInputType = z.infer<typeof UpdateCartInput>;