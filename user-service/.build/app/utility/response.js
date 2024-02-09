"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResponse = exports.SuccessResponse = void 0;
const zod_1 = require("zod");
const formatResponse = (statusCode, message, data) => {
    if (data) {
        return {
            statusCode,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                message,
                data
            })
        };
    }
    else {
        return {
            statusCode,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                message
            })
        };
    }
};
const SuccessResponse = (data) => {
    return formatResponse(200, "success", data);
};
exports.SuccessResponse = SuccessResponse;
const ErrorResponse = (code = 1000, error) => {
    if (error instanceof zod_1.ZodError) {
        return formatResponse(400, error.issues[0].message, error);
    }
    if (Array.isArray(error)) {
        const errorObject = error[0].contraints;
        const errorMessage = errorObject[Object.keys(errorObject)[0]] || "error occured";
        return formatResponse(code, errorMessage, error);
    }
    return formatResponse(code, `${error}`, error);
};
exports.ErrorResponse = ErrorResponse;
//# sourceMappingURL=response.js.map