import { APIGatewayProxyEventV2 } from "aws-lambda";
import { autoInjectable } from "tsyringe";
import { PullData } from "../message-queue";
import { CartItemModel } from "../models/CartItemsModel";
import { CartInput } from "../models/zod/CartInput";
import { CartRepository } from "../repository/cartRepository";
import { ZodErrorHandler } from "../utility/errors";
import { VerifyToken } from "../utility/password";
import { ErrorResponse, SuccessResponse } from "../utility/response";

@autoInjectable()
export default class CartService {
  repository: CartRepository;

  constructor(repository: CartRepository) {
    this.repository = repository;
  }

  // User Cart
  async CreateCart(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) {
        return ErrorResponse(403, "Invalid token");
      }

      const input = ZodErrorHandler(event, CartInput);
      if (input instanceof Error) {
        return ErrorResponse(400, input);
      }

      let currentCart = await this.repository.findShoppingCart(payload.user_id);
      if (!currentCart) {
        currentCart = await this.repository.createShoppingCart(payload.user_id);
      }

      let currentProduct = await this.repository.findCartItemByProductId(
        input.productId
      );
      if (currentProduct) {
        // update the quantity
        await this.repository.updateCartItemByProductId(
          input.productId,
          (currentProduct.item_qty += input.qty)
        );
      } else {
        // call product service to get product details
        const { data, status } = await PullData({
          action: "PULL_PRODUCT_DATA",
          productId: input.productId
        });

        if (status !== 200) {
          return ErrorResponse(500, "failed to get product details");
        }

        let cartItem = data.data as CartItemModel;
        cartItem.cart_id = currentCart.cart_id;
        cartItem.item_qty = input.qty;

        await this.repository.createCartItem(cartItem);
      }

      const cartItems = await this.repository.findCartItemsByCartId(
        currentCart.cart_id
      );

      return SuccessResponse(cartItems);
    } catch (err) {
      return ErrorResponse(500, err);
    }
  }

  async GetCart(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from get user cart" });
  }

  async UpdateCart(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from update user cart" });
  }

  async DeleteCart(event: APIGatewayProxyEventV2) {
    return SuccessResponse({ message: "response from delete user cart" });
  }
}
