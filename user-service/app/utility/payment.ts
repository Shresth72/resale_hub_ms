import Stripe from "stripe";
import { CreatePaymentSessionInputType } from "../models/zod/CreatePaymentSessionInput";
import { ErrorResponse, SuccessResponse } from "./response";

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
export const APPLICATION_FEE = (totalAmount: number) => {
  const appFee = 1.5;
  return (totalAmount / 100) * appFee;
};
export const STRIPE_FEE = (totalAmount: number) => {
  const perTransactionFee = 2.9;
  const flatFee = 0.29;
  const stripeCost = (totalAmount / 100) * perTransactionFee;
  return stripeCost + flatFee;
};

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16"
});

export const CreatePaymentSession = async ({
  email,
  phone,
  amount,
  customerId
}: CreatePaymentSessionInputType) => {
  let currentCustomerId: string;

  if (customerId) {
    const customer = await stripe.customers.retrieve(customerId);
    currentCustomerId = customer.id;
  } else {
    const customer = await stripe.customers.create({
      email,
      phone
    });
    currentCustomerId = customer.id;
  }

  const paymentIntent = await stripe.paymentIntents.create({
    customer: currentCustomerId,
    payment_method_types: ["card"],
    amount: parseInt(`${amount * 100}`),
    currency: "usd"
  });

  return {
    paymentId: paymentIntent.id,
    clientSecret: paymentIntent.client_secret,
    customerId: currentCustomerId,
    publishableKey: STRIPE_PUBLISHABLE_KEY
  };
};

export const CollectPayment = async (paymentId: string) => {
  return await stripe.paymentIntents.retrieve(paymentId);
};
