import { UserModel } from "../models/UserModel";
import { DBClient } from "../utility/databaseClient";

// Data Access Layer
export class UserRepository {
  constructor() {}

  async createAccount({ phone, email, password, salt, userType }: UserModel) {
    const client = await DBClient();
    await client.connect();

    // Create user table if it doesn't exist
    const createTableQuery = `CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      phone VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      salt VARCHAR(255) NOT NULL,
      user_type VARCHAR(255) NOT NULL,
      created_at timestamptz NOT NULL DEFAULT (now())
    );`;
    await client.query(createTableQuery);

    const queryString =
      "INSERT INTO users (phone, email, password, salt, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING *;";
    const values = [phone, email, password, salt, userType];

    const result = await client.query(queryString, values);
    await client.end();

    if (result.rowCount > 0) {
      return result.rows[0] as UserModel;
    }
  }

  async findAccount(email: string) {
    const client = await DBClient();
    await client.connect();

    const queryString =
      "SELECT id, email, password, phone, salt FROM users WHERE email = $1;";
    const values = [email];

    const result = await client.query(queryString, values);
    await client.end();

    if (result.rowCount < 1) {
      throw new Error("User not found");
    }
    return result.rows[0] as UserModel;
  }
}
