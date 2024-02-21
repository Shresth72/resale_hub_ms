import { z } from "zod";

export const ServiceInput = z.object({
  action: z.string().optional(), // GET_PRODUCT, GET_CATEGORY
  productId: z.string()
});
