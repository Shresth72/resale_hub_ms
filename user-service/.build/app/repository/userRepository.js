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
const databaseClient_1 = require("../utility/databaseClient");
// Data Access Layer
class UserRepository {
    constructor() { }
    createAccount({ phone, email, password, salt, userType }) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield (0, databaseClient_1.DBClient)();
            yield client.connect();
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
            yield client.query(createTableQuery);
            const queryString = "INSERT INTO users (phone, email, password, salt, user_type) VALUES ($1, $2, $3, $4, $5) RETURNING *;";
            const values = [phone, email, password, salt, userType];
            const result = yield client.query(queryString, values);
            yield client.end();
            if (result.rowCount > 0) {
                return result.rows[0];
            }
        });
    }
    findAccount(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield (0, databaseClient_1.DBClient)();
            yield client.connect();
            const queryString = "SELECT id, email, password, phone, salt FROM users WHERE email = $1;";
            const values = [email];
            const result = yield client.query(queryString, values);
            yield client.end();
            if (result.rowCount < 1) {
                throw new Error("User not found");
            }
            return result.rows[0];
        });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=userRepository.js.map