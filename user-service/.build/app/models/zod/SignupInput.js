"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupInput = void 0;
const zod_1 = require("zod");
const LoginInput_1 = require("./LoginInput");
exports.SignupInput = LoginInput_1.LoginInput.extend({
    phone: zod_1.z.string().min(10).max(13)
});
//# sourceMappingURL=SignupInput.js.map