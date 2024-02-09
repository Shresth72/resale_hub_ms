"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginInput = void 0;
const zod_1 = require("zod");
exports.LoginInput = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6).max(32),
});
//# sourceMappingURL=LoginInput.js.map