import { ZodError, ZodObject, ZodRawShape } from "zod";
import { APIGatewayProxyEventV2 } from "aws-lambda";

export const ZodErrorHandler = <T extends ZodRawShape>(
  event: APIGatewayProxyEventV2,
  parser: ZodObject<T>
) => {
  try {
    const input = parser.parse(JSON.parse(event.body || ""));
    return input;
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(error.message);
      return error;
    }
  }
  return null;
};
