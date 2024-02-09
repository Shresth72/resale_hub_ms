import { SuccessResponse } from "../utility/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";

export default class UserService {
  constructor() {}

  // User Creation, Verification, and Login
  async CreateUser(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from create user" });
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
