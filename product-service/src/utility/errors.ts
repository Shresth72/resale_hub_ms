import { APIGatewayEvent } from "aws-lambda";
import { ZodError, ZodObject, ZodRawShape } from "zod";

export const ZodErrorHandler = <T extends ZodRawShape>(
  event: APIGatewayEvent,
  parser: ZodObject<T>
) => {
  try {
    if (!event.body) {
      throw new Error("Invalid request body");
    }

    const input = parser.parse(JSON.parse(event.body));
    return input;
  } catch (error) {
    if (error instanceof ZodError) {
      console.log(error.message);
      return error;
    }
  }
  return new Error("Invalid request body");
};
