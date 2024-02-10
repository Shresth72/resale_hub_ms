import bcrypt from "bcrypt";

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
