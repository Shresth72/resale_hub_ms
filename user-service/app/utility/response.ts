import { ZodError } from "zod";

const formatResponse = (statusCode: number, message: string, data: unknown) => {
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
  } else {
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

export const SuccessResponse = (data: object) => {
  return formatResponse(200, "success", data);
};

export const ErrorResponse = (code = 1000, error: unknown) => {
  if (error instanceof ZodError) {
    return formatResponse(400, error.issues[0].message, error);
  }

  if (Array.isArray(error)) {
    const errorObject = error[0].contraints;
    const errorMessage =
      errorObject[Object.keys(errorObject)[0]] || "error occured";
    return formatResponse(code, errorMessage, error);
  }

  return formatResponse(code, `${error}`, error);
};
