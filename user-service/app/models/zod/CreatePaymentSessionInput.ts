import { z } from "zod";

export const CreatePaymentSessionInput = z.object({
  phone: z.string(),
  email: z.string(),
  amount: z.number(),
  customerId: z.string().optional()
});

export type CreatePaymentSessionInputType = z.infer<
  typeof CreatePaymentSessionInput
>;
