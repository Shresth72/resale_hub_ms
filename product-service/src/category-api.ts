import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { CategoryRepository } from "./repository/category-repository";
import { CategoryService } from "./service/category-service";
import "./utility";
import { ErrorResponse } from "./utility/response";

const service = new CategoryService(new CategoryRepository());

// Category service lambda handler function
export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const isRoot = event.pathParameters === null;

  switch (event.httpMethod.toLowerCase()) {
    case "post":
      if (isRoot) {
        return service.createCategory(event);
      }
      break;
    case "get":
      return isRoot ? service.getCategories(event) : service.getCategory(event);
    case "put":
      if (!isRoot) {
        return service.updateCategory(event);
      }
      break;
    case "delete":
      if (!isRoot) {
        return service.deleteCategory(event);
      }
      break;
    default:
      break;
  }
  return ErrorResponse(404, "Invalid request");
};
