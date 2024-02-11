import { z } from "zod";

export const VerificationInput = z.object({
  code: z.number().min(100000).max(999999)
});
