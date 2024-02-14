import { z } from "zod";

export const AddressInput = z.object({
  addressLine1: z.string().min(1).max(255),
  addressLine2: z.string().min(1).max(255),
  city: z.string().min(1).max(100),
  post_code: z.string().min(1).max(100),
  country: z.string().min(1).max(100)
});

export const ProfileInput = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  address: AddressInput,
  userType: z.enum(["BUYER", "SELLER"])
});

export type AddressInputType = z.infer<typeof AddressInput>;
export type ProfileInputType = z.infer<typeof ProfileInput>;
