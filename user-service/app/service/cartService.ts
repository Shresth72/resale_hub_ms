import { APIGatewayProxyEventV2 } from "aws-lambda";
import aws from "aws-sdk";
import { autoInjectable } from "tsyringe";
import { PullData } from "../message-queue";
import { CartItemModel } from "../models/CartItemsModel";
import { CartInput, UpdateCartInput } from "../models/zod/CartInput";
import { CartRepository } from "../repository/cartRepository";
import { UserRepository } from "../repository/userRepository";
import { ZodErrorHandler } from "../utility/errors";
import { VerifyToken } from "../utility/password";
import {
  APPLICATION_FEE,
  CollectPayment,
  CreatePaymentSession,
  STRIPE_FEE
} from "../utility/payment";
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
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) {
        return ErrorResponse(403, "Invalid token");
      }

      const currentCart = await this.repository.findCartItems(payload.user_id);
      if (!currentCart) {
        return SuccessResponse({ message: "cart is empty" });
      }
      const totalAmount = currentCart.reduce(
        (sum, item) => sum + item.price * item.item_qty,
        0
      );
      const appFee = APPLICATION_FEE(totalAmount) + STRIPE_FEE(totalAmount);

      return SuccessResponse({
        currentCart,
        totalAmount,
        appFee
      });
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }

  async UpdateCart(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const cartId = Number(event.pathParameters.id);

      const payload = await VerifyToken(token);
      if (!payload) {
        return ErrorResponse(403, "Invalid token");
      }

      const input = ZodErrorHandler(event, UpdateCartInput);
      if (input instanceof Error) {
        return ErrorResponse(400, input);
      }

      const cartItem = await this.repository.updateCartItemById(
        cartId,
        input.qty
      );
      return SuccessResponse(cartItem);
    } catch (err) {
      return ErrorResponse(500, err);
    }
  }

  async DeleteCart(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const cartItemId = Number(event.pathParameters.id);

      const payload = await VerifyToken(token);
      if (!payload) {
        return ErrorResponse(403, "Invalid token");
      }

      const deletedItem = await this.repository.deleteCartItem(cartItemId);

      return SuccessResponse(deletedItem);
    } catch (err) {
      return ErrorResponse(500, err);
    }
  }

  async CollectPayment(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) {
        return ErrorResponse(403, "Invalid token");
      }

      const { stripe_id, email, phone } =
        await new UserRepository().getUserProfile(payload.user_id);
      const cartItems = await this.repository.findCartItems(payload.user_id);

      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.item_qty,
        0
      );

      const appFee = APPLICATION_FEE(total);
      const stripeFee = STRIPE_FEE(total);
      const amount = total + appFee + stripeFee;

      // initialize payment gateway
      const { clientSecret, customerId, paymentId, publishableKey } =
        await CreatePaymentSession({
          amount,
          customerId: stripe_id,
          email,
          phone
        });

      await new UserRepository().updateUserPayment({
        userId: payload.user_id,
        paymentId,
        customerId
      });

      return SuccessResponse({
        clientSecret,
        publishableKey
      });
    } catch (error) {
      return ErrorResponse(500, error);
    }
  }

  async PlaceOrder(event: APIGatewayProxyEventV2) {
    const token = event.headers.authorization;
    const payload = await VerifyToken(token);
    if (!payload) {
      return ErrorResponse(403, "Invalid token");
    }

    const { payment_id } = await new UserRepository().getUserProfile(
      payload.user_id
    );
    const paymentInfo = await CollectPayment(payment_id);

    if (paymentInfo.status === "succeeded") {
      const cartItems = await this.repository.findCartItems(payload.user_id);

      // send SNS topic to create order [transaction ms] => email to user => update inventory [product ms]
      const params = {
        Message: JSON.stringify(cartItems),
        TopicArn: process.env.SNS_TOPIC,
        MessageAttributes: {
          actionType: {
            DataType: "String",
            StringValue: "place_order"
          }
        }
      };
      const sns = new aws.SNS();
      const response = await sns.publish(params).promise();
      console.log("SNS response: ", response);

      return SuccessResponse({ message: "order placed" });
    }

    return ErrorResponse(500, "payment not successful");
  }
}
