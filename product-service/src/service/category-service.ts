import { APIGatewayEvent } from "aws-lambda";
import { CategoryRepository } from "../repository/category-repository";
import { CategoryInput, NewCategoryInput } from "../types/category-input";
import { ZodErrorHandler } from "../utility/errors";
import { ErrorResponse, SuccessResponse } from "../utility/response";

export class CategoryService {
  _repository: CategoryRepository;
  constructor(repository: CategoryRepository) {
    this._repository = repository;
  }

  async createCategory(event: APIGatewayEvent) {
    try {
      const input = ZodErrorHandler(event, NewCategoryInput);
      if (input instanceof Error) {
        return ErrorResponse(400, input);
      }

      const data = await this._repository.createCategory(input);

      return SuccessResponse(data, 201);
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }

  async getCategories(event: APIGatewayEvent) {
    try {
      const type = event.queryStringParameters?.type;
      const offset = Number(event.queryStringParameters?.offset);
      const perPage = Number(event.queryStringParameters?.perPage);

      if (type === "top") {
        const data = await this._repository.getTopCategories();
        if (!data) {
          return SuccessResponse({ message: "No categories found" }, 204);
        }
        return SuccessResponse(data);
      }

      const data = await this._repository.getAllCategories(offset, perPage);
      if (!data) {
        return SuccessResponse({ message: "No categories found" }, 204);
      }

      return SuccessResponse(data);
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }

  async getCategory(event: APIGatewayEvent) {
    try {
      const offset = Number(event.queryStringParameters?.offset);
      const perPage = Number(event.queryStringParameters?.perPage);

      const id = event.pathParameters?.id;
      if (!id) {
        return ErrorResponse(400, "category id is required");
      }

      const data = await this._repository.getCategoryById(id, offset, perPage);
      if (!data) {
        return ErrorResponse(404, "category not found");
      }

      return SuccessResponse(data);
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }

  async updateCategory(event: APIGatewayEvent) {
    try {
      const id = event.pathParameters?.id;
      if (!id) {
        return ErrorResponse(400, "category id is required");
      }

      const input = ZodErrorHandler(event, CategoryInput);
      if (input instanceof Error) {
        return ErrorResponse(400, input);
      }

      const data = await this._repository.updateCategory(id, input);
      return SuccessResponse(data);
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }

  async deleteCategory(event: APIGatewayEvent) {
    try {
      const id = event.pathParameters?.id;
      if (!id) {
        return ErrorResponse(400, "category id is required");
      }

      const data = await this._repository.deleteCategory(id);
      return SuccessResponse(data);
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }
}
