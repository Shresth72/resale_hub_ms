import { APIGatewayEvent } from "aws-lambda";
import { ProductRepository } from "../repository/product-repository";
import { NewProductInput, ProductInput } from "../types/product-input";
import { ZodErrorHandler } from "../utility/errors";
import { ErrorResponse, SuccessResponse } from "../utility/response";

export class ProductService {
  _repository: ProductRepository;

  constructor(repository: ProductRepository) {
    this._repository = repository;
  }

  async createProduct(event: APIGatewayEvent) {
    try {
      const input = ZodErrorHandler(event, NewProductInput);
      if (input instanceof Error) {
        return ErrorResponse(400, input);
      }

      const data = await this._repository.createProduct(input);

      return SuccessResponse(data, 201);
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }

  async getProducts(event: APIGatewayEvent) {
    try {
      const data = await this._repository.getAllProducts();
      if (!data) {
        return SuccessResponse({}, 204);
      }

      return SuccessResponse(data);
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }

  async getProduct(event: APIGatewayEvent) {
    try {
      const id = event.pathParameters?.id;
      if (!id) {
        return ErrorResponse(400, "product id is required");
      }

      const data = await this._repository.getProductById(id);
      if (!data) {
        return ErrorResponse(404, "product not found");
      }

      return SuccessResponse(data);
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }

  async updateProduct(event: APIGatewayEvent) {
    try {
      const id = event.pathParameters?.id;
      if (!id) {
        return ErrorResponse(400, "product id is required");
      }

      const input = ZodErrorHandler(event, NewProductInput);
      if (input instanceof Error) {
        return ErrorResponse(400, input);
      }

      const data = await this._repository.updateProduct(id, input);
      return SuccessResponse(data);
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }

  async deleteProduct(event: APIGatewayEvent) {
    try {
      const id = event.pathParameters?.id;
      if (!id) {
        return ErrorResponse(400, "product id is required");
      }

      const data = await this._repository.deleteProduct(id);
      return SuccessResponse(data);
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }
}
