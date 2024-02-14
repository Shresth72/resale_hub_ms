"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tsyringe_1 = require("tsyringe");
const AddressInput_1 = require("../models/zod/AddressInput");
const LoginInput_1 = require("../models/zod/LoginInput");
const SignupInput_1 = require("../models/zod/SignupInput");
const UpdateInput_1 = require("../models/zod/UpdateInput");
const userRepository_1 = require("../repository/userRepository");
const dateHelper_1 = require("../utility/dateHelper");
const errors_1 = require("../utility/errors");
const notification_1 = require("../utility/notification");
const password_1 = require("../utility/password");
const response_1 = require("../utility/response");
let UserService = class UserService {
    constructor(repository) {
        this.repository = repository;
    }
    // User Creation, Verification, and Login
    CreateUser(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = (0, errors_1.ZodErrorHandler)(event, SignupInput_1.SignupInput);
                if (input instanceof Error) {
                    return (0, response_1.ErrorResponse)(400, input);
                }
                const salt = yield (0, password_1.GetSalt)();
                const hashedPassword = yield (0, password_1.GetHashedPassword)(input.password, salt);
                const data = yield this.repository.createAccount({
                    email: input.email,
                    password: hashedPassword,
                    salt,
                    phone: input.phone,
                    userType: "BUYER"
                });
                return (0, response_1.SuccessResponse)(data);
            }
            catch (err) {
                return (0, response_1.ErrorResponse)(500, err);
            }
        });
    }
    UserLogin(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const input = (0, errors_1.ZodErrorHandler)(event, LoginInput_1.LoginInput);
                if (input instanceof Error) {
                    return (0, response_1.ErrorResponse)(400, input);
                }
                const data = yield this.repository.findAccount(input.email);
                const verify = yield (0, password_1.ValidatePassword)(input.password, data.password, data.salt);
                if (!verify) {
                    return (0, response_1.ErrorResponse)(401, "Password is incorrect");
                }
                const token = (0, password_1.GetToken)(data);
                return (0, response_1.SuccessResponse)({ token });
            }
            catch (err) {
                return (0, response_1.ErrorResponse)(500, err);
            }
        });
    }
    GetVerificationToken(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = event.headers.authorization;
            const payload = yield (0, password_1.VerifyToken)(token);
            if (!payload) {
                return (0, response_1.ErrorResponse)(403, "Invalid token");
            }
            const { code, expiry } = (0, notification_1.GenerateAccessCode)();
            yield this.repository.updateVerificationCode(payload.user_id, code, expiry);
            console.log(code, expiry);
            // const reponse = await SendVerificationCode(code, payload.phone);
            return (0, response_1.SuccessResponse)({
                message: "verification code is sent to your registered phone number"
            });
        });
    }
    VerifyUser(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = event.headers.authorization;
            const payload = yield (0, password_1.VerifyToken)(token);
            if (!payload) {
                return (0, response_1.ErrorResponse)(403, "Invalid token");
            }
            const input = (0, errors_1.ZodErrorHandler)(event, UpdateInput_1.VerificationInput);
            if (input instanceof Error) {
                return (0, response_1.ErrorResponse)(400, input);
            }
            const { verification_code, expiry } = yield this.repository.findAccount(payload.email);
            // find the user account
            if (verification_code === input.code) {
                // check expiry
                const currentTime = new Date();
                const diff = (0, dateHelper_1.TimeDifference)(expiry, currentTime.toISOString(), "m");
                if (diff > 0) {
                    console.log("verified successfully");
                    // update on DB
                    yield this.repository.updateVerifyUser(payload.user_id);
                }
                else {
                    return (0, response_1.ErrorResponse)(403, "Verification code has expired");
                }
            }
            return (0, response_1.SuccessResponse)({ message: "user verified successfully" });
        });
    }
    // User Profile
    CreateProfile(event) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = event.headers.authorization;
                const payload = yield (0, password_1.VerifyToken)(token);
                if (!payload) {
                    return (0, response_1.ErrorResponse)(403, "Invalid token");
                }
                const input = (0, errors_1.ZodErrorHandler)(event, AddressInput_1.ProfileInput);
                if (input instanceof Error) {
                    return (0, response_1.ErrorResponse)(400, input);
                }
                // DB Operation
                const result = yield this.repository.createProfile(payload.user_id, input);
                console.log(result);
                return (0, response_1.SuccessResponse)({ message: "user profile created successfully" });
            }
            catch (err) {
                return (0, response_1.ErrorResponse)(500, err);
            }
        });
    }
    GetProfile(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: "response from get user profile" });
        });
    }
    UpdateProfile(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: "response from update user profile" });
        });
    }
    // User Cart
    CreateCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: "response from create user cart" });
        });
    }
    GetCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: "response from get user cart" });
        });
    }
    UpdateCart(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: "response from update user cart" });
        });
    }
    // User Payment
    CreatePaymentMethod(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: "response from create user payment" });
        });
    }
    GetPaymentMethod(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: "response from get user payment" });
        });
    }
    UpdatePaymentMethod(event) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, response_1.SuccessResponse)({ message: "response from update user payment" });
        });
    }
};
UserService = __decorate([
    (0, tsyringe_1.autoInjectable)(),
    __metadata("design:paramtypes", [userRepository_1.UserRepository])
], UserService);
exports.default = UserService;
//# sourceMappingURL=userService.js.map