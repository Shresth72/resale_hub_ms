import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { ProductRepository } from "./repository/product-repository";
import { ProductService } from "./service/product-service";
import "./utility";
import { ErrorResponse } from "./utility/response";

const service = new ProductService(new ProductRepository());

// Message Queue lambda handler function
export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    return service.handleQueueOperation(event);
  } catch (error) {
    return ErrorResponse(404, "Invalid request");
  }
};
