import { UserModel } from "../models/UserModel";

// Data Access Layer
export class UserRepository {
  constructor() {}

  async createAccount({ email, password, salt, phone, userType }: UserModel) {
    // DB Operation
    
  }
}
