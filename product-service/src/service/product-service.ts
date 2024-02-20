import { ProductRepository } from "../repository/product-repository";
import { SuccessResponse } from "../utility/response";

export class ProductService {
  _repository: ProductRepository;

  constructor(repository: ProductRepository) {
    this._repository = repository;
  }

  async createProduct() {
    return SuccessResponse({ message: "Product created successfully" });
  }

  async getProducts() {
    return SuccessResponse({ message: "Product retrieved successfully" });
  }

  async getProduct() {
    return SuccessResponse({ message: "Product retrieved successfully" });
  }

  async updateProduct() {
    return SuccessResponse({ message: "Product updated successfully" });
  }

  async deleteProduct() {
    return SuccessResponse({ message: "Product deleted successfully" });
  }
}
