import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/UserModel";
import dotenv from "dotenv";

dotenv.config();

export const GetSalt = async () => {
  return await bcrypt.genSalt(10);
};

export const GetHashedPassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

export const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string,
  savedSalt: string
) => {
  return (
    (await GetHashedPassword(enteredPassword, savedSalt)) === savedPassword
  );
};

export const GetToken = ({ email, user_id, phone, userType }: UserModel) => {
  return jwt.sign(
    {
      user_id,
      email,
      phone,
      userType
    },
    process.env.APP_SECRET as string,
    {
      expiresIn: "1d"
    }
  );
};

export const VerifyToken = async (
  token: string
): Promise<UserModel | false> => {
  try {
    if (token != "") {
      const payload = jwt.verify(
        token.split(" ")[1],
        process.env.APP_SECRET as string
      );
      return payload as UserModel;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};
