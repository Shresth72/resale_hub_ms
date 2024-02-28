import axios from "axios";

const PRODUCT_SERVICE_URL = "http://127.0.0.1:3000/products-queue";
// Product service DNS URL from the EC2 instance => `url/products-queue`

export const PullData = (requestData: Record<string, unknown>) => {
  return axios.post(PRODUCT_SERVICE_URL, requestData);
};
