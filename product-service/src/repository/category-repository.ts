import { CategoryDoc, categories } from "../models";
import {
  AddItemInputType,
  CategoryInputType,
  NewCategoryInputType
} from "../types/category-input";

export class CategoryRepository {
  constructor() {}

  async createCategory({
    name,
    parentId,
    imageUrl,
    products
  }: NewCategoryInputType) {
    const newCategory = await categories.create({
      name,
      parentId,
      products: products || [],
      subCategories: [],
      imageUrl
    });

    if (parentId) {
      const parent = (await categories.findById(parentId)) as CategoryDoc;
      parent.subCategories = [...parent.subCategories, newCategory];
      await parent.save();
    }
    return newCategory;
  }

  async getAllCategories(offset = 0, perPage?: number) {
    return await categories
      .find({ parentId: null })
      .populate({
        path: "subCategories",
        model: "categories",
        populate: {
          path: "subCategories",
          model: "categories"
        }
      })
      .skip(offset)
      .limit(perPage ? perPage : 100);
  }

  async getTopCategories() {
    return await categories
      .find(
        { parentId: { $ne: null } },
        {
          products: { $slice: 10 }
        }
      )
      .populate({
        path: "products",
        model: "products"
      })
      .sort({ displayOrder: "descending" })
      .limit(10);
  }

  async getCategoryById(id: string, offset = 0, perPage?: number) {
    return await categories
      .findById(id, {
        products: { $slice: [offset, perPage ? perPage : 100] }
      })
      .populate({
        path: "products",
        model: "products"
      });
  }

  async updateCategory(
    id: string,
    { name, displayOrder, parentId, imageUrl }: CategoryInputType
  ) {
    let category = (await categories.findById(id)) as CategoryDoc;
    if (!category) {
      throw new Error("category not found");
    }

    category.name = name;
    category.displayOrder = displayOrder;
    category.imageUrl = imageUrl;
    if (parentId) {
      category.parentId = parentId;
    }

    return await category.save();
  }

  async deleteCategory(id: string) {
    return await categories.deleteOne({ id });
  }

  async addItem({ id, products }: AddItemInputType) {
    let category = (await categories.findById(id)) as CategoryDoc;
    if (!category) {
      throw new Error("category not found");
    }

    category.products = [...category.products, ...products];
    return await category.save();
  }

  async removeItem({ id, products }: AddItemInputType) {
    let category = (await categories.findById(id)) as CategoryDoc;
    if (!category) {
      throw new Error("category not found");
    }

    category.products = category.products.filter(
      (product) => !products.includes(product)
    );
    return await category.save();
  }
}
