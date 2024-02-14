import { z } from "zod";

export const AddressInput = z.object({
  addressLine1: z.string().min(1).max(255),
  addressLine2: z.string().min(1).max(255),
  city: z.string().min(1).max(100),
  postCode: z.string().min(1).max(100),
  country: z.string().min(1).max(100)
});

export const ProfileInput = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  address: AddressInput,
  userType: z.enum(["BUYER", "SELLER"])
});

export const AddressInputType = {
  addressLine1: "string",
  addressLine2: "string",
  city: "string",
  postCode: "string",
  country: "string"
};

export const ProfileInputType = {
  firstName: "string",
  lastName: "string",
  address: AddressInputType,
  userType: "enum"
};
