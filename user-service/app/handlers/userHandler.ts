import { APIGatewayProxyEventV2 } from "aws-lambda";
import { container } from "tsyringe";
import CartService from "../service/cartService";
import UserService from "../service/userService";
import { ErrorResponse } from "../utility/response";

const service = container.resolve(UserService);
const cartService = container.resolve(CartService);

export const Signup = async (event: APIGatewayProxyEventV2) => {
  return service.CreateUser(event);
};

export const Login = async (event: APIGatewayProxyEventV2) => {
  return service.UserLogin(event);
};

export const Verify = async (event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") {
    return service.VerifyUser(event);
  } else if (httpMethod === "get") {
    return service.GetVerificationToken(event);
  } else {
    return ErrorResponse(404, "invalid http method");
  }
};

export const Profile = async (event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();

  if (httpMethod === "post") {
    return service.CreateProfile(event);
  } else if (httpMethod === "get") {
    return service.GetProfile(event);
  } else if (httpMethod === "put") {
    return service.UpdateProfile(event);
  } else {
    return ErrorResponse(404, "invalid http method");
  }
};

export const Cart = async (event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();

  if (httpMethod === "post") {
    return cartService.CreateCart(event);
  } else if (httpMethod === "get") {
    return cartService.GetCart(event);
  } else if (httpMethod === "put") {
    return cartService.UpdateCart(event);
  } else if (httpMethod === "delete") {
    return cartService.DeleteCart(event);
  } else {
    return ErrorResponse(404, "invalid http method");
  }
};

export const Payment = async (event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();

  if (httpMethod === "post") {
    return service.CreatePaymentMethod(event);
  } else if (httpMethod === "get") {
    return service.GetPaymentMethod(event);
  } else if (httpMethod === "put") {
    return service.UpdatePaymentMethod(event);
  } else {
    return ErrorResponse(404, "invalid http method");
  }
};
