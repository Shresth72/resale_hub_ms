import { APIGatewayProxyEventV2 } from "aws-lambda";
import UserService from "../service/userService";
import { ErrorResponse } from "../utility/response";
import { container } from "tsyringe";
import middy from "@middy/core";
import jsonBodyParser from "@middy/http-json-body-parser";

const service = container.resolve(UserService);

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
    return service.CreateCart(event);
  } else if (httpMethod === "get") {
    return service.GetCart(event);
  } else if (httpMethod === "put") {
    return service.UpdateCart(event);
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
