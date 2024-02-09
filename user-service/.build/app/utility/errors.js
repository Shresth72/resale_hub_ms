"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZodErrorHandler = void 0;
const zod_1 = require("zod");
const ZodErrorHandler = (event, parser) => {
    try {
        const input = parser.parse(JSON.parse(event.body));
        return input;
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            console.log(error.message);
            return error;
        }
    }
};
exports.ZodErrorHandler = ZodErrorHandler;
//# sourceMappingURL=errors.js.map