import { APIGatewayEvent } from "aws-lambda";
import { ProductRepository } from "../repository/product-repository";
import { ProductInput } from "../types/product-input";
import { ServiceInput } from "../types/service-input";
import { ZodErrorHandler } from "../utility/errors";
import { ErrorResponse, SuccessResponse } from "../utility/response";
import { CategoryRepository } from "./../repository/category-repository";

export class ProductService {
  _repository: ProductRepository;

  constructor(repository: ProductRepository) {
    this._repository = repository;
  }

  async createProduct(event: APIGatewayEvent) {
    try {
      const input = ZodErrorHandler(event, ProductInput);
      if (input instanceof Error) {
        return ErrorResponse(400, input);
      }

      const data = await this._repository.createProduct(input);

      await new CategoryRepository().addItem({
        id: input.category_id,
        products: [data._id]
      });

      return SuccessResponse(data, 201);
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }

  async getProducts(event: APIGatewayEvent) {
    try {
      const data = await this._repository.getAllProducts();
      if (!data) {
        return SuccessResponse({ message: "No products found" }, 204);
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

      const input = ZodErrorHandler(event, ProductInput);
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
      const product_id = event.pathParameters?.id;
      if (!product_id) {
        return ErrorResponse(400, "product id is required");
      }

      const { category_id, deleteResult } =
        await this._repository.deleteProduct(product_id);
      await new CategoryRepository().removeItem({
        id: category_id,
        products: [product_id]
      });

      return SuccessResponse(deleteResult);
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }

  // HTTP calls -> RPC Queues
  async handleQueueOperation(event: APIGatewayEvent) {
    // TODO: Implement RPC Queue operations 
    const input = ZodErrorHandler(event, ServiceInput); // GET_PRODUCT Action
    if (input instanceof Error) {
      return ErrorResponse(400, input);
    }

    const { _id, name, price, image_url } =
      await this._repository.getProductById(input.productId);

    return SuccessResponse({
      product_id: _id,
      name,
      price,
      image_url
    });
  }
}
