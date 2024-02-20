import products, { ProductDoc } from "../models/product-model";
import { NewProductInputType, ProductInputType } from "../types/product-input";

export class ProductRepository {
  constructor() {}

  async createProduct({
    name,
    description,
    category_id,
    image_url,
    price,
    availability
  }: NewProductInputType) {
    // check if product already exists
    const product = await products.findOne({ name });
    if (product) {
      throw new Error("Product already exists");
    }

    return await products.create({
      name,
      description,
      category_id,
      image_url,
      price,
      availability
    });
  }

  async getAllProducts(offset = 0, pages?: number) {
    return await products
      .find()
      .skip(offset)
      .limit(pages || 10);
  }

  async getProductById(id: string) {
    return await products.findById(id);
  }

  async updateProduct(
    id: string,
    {
      name,
      description,
      category_id,
      image_url,
      price,
      availability
    }: NewProductInputType
  ) {
    let existingProduct = (await products.findById(id)) as ProductDoc;
    if (!existingProduct) {
      throw new Error("Product not found");
    }

    existingProduct.name = name;
    existingProduct.description = description;
    existingProduct.category_id = category_id;
    existingProduct.image_url = image_url;
    existingProduct.price = price;
    existingProduct.availability = availability;

    return await existingProduct.save();
  }

  async deleteProduct(id: string) {
    return products.deleteOne({ _id: id });
  }
}
