import { APIGatewayProxyEventV2 } from "aws-lambda";
import { autoInjectable } from "tsyringe";
import { ProfileInput } from "../models/zod/AddressInput";
import { LoginInput } from "../models/zod/LoginInput";
import { SignupInput } from "../models/zod/SignupInput";
import { VerificationInput } from "../models/zod/UpdateInput";
import { UserRepository } from "../repository/userRepository";
import { TimeDifference } from "../utility/dateHelper";
import { ZodErrorHandler } from "../utility/errors";
import {
  GenerateAccessCode,
  SendVerificationCode
} from "../utility/notification";
import {
  GetHashedPassword,
  GetSalt,
  GetToken,
  ValidatePassword,
  VerifyToken
} from "../utility/password";
import { ErrorResponse, SuccessResponse } from "../utility/response";

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
    try {
      const input = ZodErrorHandler(event, LoginInput);
      if (input instanceof Error) {
        return ErrorResponse(400, input);
      }

      const data = await this.repository.findAccount(input.email);
      const verify = await ValidatePassword(
        input.password,
        data.password,
        data.salt
      );

      if (!verify) {
        return ErrorResponse(401, "Password is incorrect");
      }
      const token = GetToken(data);

      return SuccessResponse({ token });
    } catch (err) {
      return ErrorResponse(500, err);
    }
  }

  async GetVerificationToken(event: APIGatewayProxyEventV2) {
    const token = event.headers.authorization;
    const payload = await VerifyToken(token);

    if (!payload) {
      return ErrorResponse(403, "Invalid token");
    }
    const { code, expiry } = GenerateAccessCode();

    await this.repository.updateVerificationCode(payload.user_id, code, expiry);

    console.log(code, expiry);

    // const reponse = await SendVerificationCode(code, payload.phone);
    return SuccessResponse({
      message: "verification code is sent to your registered phone number"
    });
  }

  async VerifyUser(event: APIGatewayProxyEventV2) {
    const token = event.headers.authorization;
    const payload = await VerifyToken(token);

    if (!payload) {
      return ErrorResponse(403, "Invalid token");
    }

    const input = ZodErrorHandler(event, VerificationInput);
    if (input instanceof Error) {
      return ErrorResponse(400, input);
    }

    const { verification_code, expiry } = await this.repository.findAccount(
      payload.email
    );

    // find the user account
    if (verification_code === input.code) {
      // check expiry
      const currentTime = new Date();
      const diff = TimeDifference(expiry, currentTime.toISOString(), "m");

      if (diff > 0) {
        console.log("verified successfully");

        // update on DB
        await this.repository.updateVerifyUser(payload.user_id);
      } else {
        return ErrorResponse(403, "Verification code has expired");
      }
    }

    return SuccessResponse({ message: "user verified successfully" });
  }

  // User Profile
  async CreateProfile(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) {
        return ErrorResponse(403, "Invalid token");
      }

      const input = ZodErrorHandler(event, ProfileInput);
      if (input instanceof Error) {
        return ErrorResponse(400, input);
      }

      // DB Operation
      const result = await this.repository.createProfile(
        payload.user_id,
        input
      );
      console.log(result);
      return SuccessResponse({
        message: "user profile created successfully",
        result
      });
    } catch (err) {
      return ErrorResponse(500, err);
    }
  }

  async GetProfile(event: APIGatewayProxyEventV2) {
    const token = event.headers.authorization;
    const payload = await VerifyToken(token);
    if (!payload) {
      return ErrorResponse(403, "Invalid token");
    }

    const result = await this.repository.getUserProfile(payload.user_id);

    return SuccessResponse({
      message: "user profile fetched successfully",
      result
    });
  }

  async UpdateProfile(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) {
        return ErrorResponse(403, "Invalid token");
      }

      const input = ZodErrorHandler(event, ProfileInput);
      if (input instanceof Error) {
        return ErrorResponse(400, input);
      }

      // DB Operation
      await this.repository.editProfile(payload.user_id, input);
      return SuccessResponse({
        message: "user profile updated successfully"
      });
    } catch (err) {
      return ErrorResponse(500, err);
    }
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
