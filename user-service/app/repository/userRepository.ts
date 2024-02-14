import { UserModel } from "../models/UserModel";
import { DBClient } from "../utility/databaseClient";
import { ProfileInputType } from "./../models/zod/AddressInput";
import { DBOperation } from "./dbOperation";

// Data Access Layer
export class UserRepository extends DBOperation {
  constructor() {
    super();
  }

  async createAccount({ phone, email, password, salt, userType }: UserModel) {
    const queryString =
      "INSERT INTO users (phone, email, password, salt, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING *;";
    const values = [phone, email, password, salt, userType];

    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
  }

  async findAccount(email: string) {
    const queryString =
      "SELECT user_id, email, password, phone, salt, verification_code, expiry FROM users WHERE email = $1;";
    const values = [email];

    const result = await this.executeQuery(queryString, values);

    if (result.rowCount < 1) {
      throw new Error("user not found");
    }
    return result.rows[0] as UserModel;
  }

  async updateVerificationCode(user_id: number, code: number, expiry: Date) {
    const queryString =
      "UPDATE users SET verification_code = $1, expiry = $2 WHERE user_id = $3 AND verified=FALSE RETURNING *;";
    const values = [code, expiry, user_id];

    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("user already verified");
  }

  async updateVerifyUser(user_id: number) {
    const queryString =
      "UPDATE users SET verified=TRUE WHERE user_id = $1 AND verified=FALSE RETURNING *;";
    const values = [user_id];

    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("user already verified");
  }

  async updateUser(
    user_id: number,
    firstName: string,
    lastName: string,
    userType: string
  ) {
    const queryString =
      "UPDATE users SET first_name=$1, last_name=$2, user_type=$3 WHERE user_id=$4 RETURNING *;";
    const values = [firstName, lastName, userType, user_id];

    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
    throw new Error("error while updating user");
  }

  async createProfile(
    user_id: number,
    {
      firstName,
      lastName,
      userType,
      address: { addressLine1, addressLine2, city, postCode, country }
    }: typeof ProfileInputType
  ) {
    const updatedUser = await this.updateUser(
      user_id,
      firstName,
      lastName,
      userType
    );

    const queryString =
      "INSERT INTO address(user_id, address_line1, address_line2, city, post_code, country) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;";
    const values = [
      user_id,
      addressLine1,
      addressLine2,
      city,
      postCode,
      country
    ];

    const result = await this.executeQuery(queryString, values);
    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }

    return true;
  }
}
