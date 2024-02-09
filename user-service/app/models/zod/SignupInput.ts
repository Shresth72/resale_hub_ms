import { z } from "zod";
import { LoginInput } from "./LoginInput";

export const SignupInput = LoginInput.extend({
  phone: z.string().min(10).max(13)
});
