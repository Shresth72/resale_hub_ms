"use strict";
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
exports.UserRepository = void 0;
const dbOperation_1 = require("./dbOperation");
// Data Access Layer
class UserRepository extends dbOperation_1.DBOperation {
    constructor() {
        super();
    }
    createAccount({ phone, email, password, salt, userType }) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "INSERT INTO users (phone, email, password, salt, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING *;";
            const values = [phone, email, password, salt, userType];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
        });
    }
    findAccount(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "SELECT user_id, email, password, phone, salt, verification_code, expiry FROM users WHERE email = $1;";
            const values = [email];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount < 1) {
                throw new Error("user not found");
            }
            return result.rows[0];
        });
    }
    updateVerificationCode(user_id, code, expiry) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "UPDATE users SET verification_code = $1, expiry = $2 WHERE user_id = $3 AND verified=FALSE RETURNING *;";
            const values = [code, expiry, user_id];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            throw new Error("user already verified");
        });
    }
    updateVerifyUser(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "UPDATE users SET verified=TRUE WHERE user_id = $1 AND verified=FALSE RETURNING *;";
            const values = [user_id];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            throw new Error("user already verified");
        });
    }
    updateUser(user_id, firstName, lastName, userType) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "UPDATE users SET first_name=$1, last_name=$2, user_type=$3 WHERE user_id=$4 RETURNING *;";
            const values = [firstName, lastName, userType, user_id];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            throw new Error("error while updating user");
        });
    }
    createProfile(user_id, { firstName, lastName, address: { addressLine1, addressLine2, city, post_code, country }, userType }) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "INSERT INTO address(user_id, address_line1, address_line2, city, post_code, country) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;";
            const values = [
                user_id,
                addressLine1,
                addressLine2,
                city,
                post_code,
                country
            ];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            throw new Error("error while creating profile");
        });
    }
    getUserProfile(user_id) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=userRepository.js.map