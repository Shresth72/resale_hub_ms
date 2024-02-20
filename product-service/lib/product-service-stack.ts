import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApiGatewayStack } from "./api_gateway-stack";
import { ServiceStack } from "./service-stack";

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda function Stack for the product service
    const { productService, categoryService, dealsService, imageService } =
      new ServiceStack(this, "ProductService", {
        bucket: "BUCKET_ARN"
      });

    // Api Gateway Stack
    new ApiGatewayStack(this, "ApiGateway", {
      productService,
      categoryService,
      dealsService,
      imageService
    });
  }
}
