import { ErrorResponse, SuccessResponse } from "../utility/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserRepository } from "../repository/userRepository";
import { autoInjectable } from "tsyringe";
import { SignupInput } from "../models/zod/SignupInput";
import { ZodErrorHandler } from "../utility/errors";
import {
  GetSalt,
  GetHashedPassword,
  ValidatePassword
} from "../utility/password";

@autoInjectable()
export default class UserService {
  repository: UserRepository;

  constructor(repository: UserRepository) {
    this.repository = repository;
  }

  // User Creation, Verification, and Login
  async CreateUser(event: APIGatewayProxyEventV2) {
    try {
      const input = ZodErrorHandler(event, SignupInput);
      if (input instanceof Error) {
        return ErrorResponse(400, input);
      }

      const salt = await GetSalt();
      const hashedPassword = await GetHashedPassword(input.password, salt);
      const data = await this.repository.createAccount({
        email: input.email,
        password: hashedPassword,
        salt,
        phone: input.phone,
        userType: "BUYER"
      });

      return SuccessResponse(data);
    } catch (err) {
      return ErrorResponse(500, err);
    }
  }

  async UserLogin(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from user login" });
  }

  async VerifyUser(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from verify user" });
  }

  // User Profile
  async CreateProfile(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from create user profile" });
  }

  async GetProfile(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from get user profile" });
  }

  async UpdateProfile(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from update user profile" });
  }

  // User Cart
  async CreateCart(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from create user cart" });
  }

  async GetCart(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from get user cart" });
  }

  async UpdateCart(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from update user cart" });
  }

  // User Payment
  async CreatePaymentMethod(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from create user payment" });
  }

  async GetPaymentMethod(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from get user payment" });
  }

  async UpdatePaymentMethod(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from update user payment" });
  }
}
