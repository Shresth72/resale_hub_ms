import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApiGatewayStack } from "./api_gateway-stack";
import { S3BucketStack } from "./s3bucket-stack";
import { ServiceStack } from "./service-stack";

export class ProductServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { bucket } = new S3BucketStack(this, "productsImages");

    // The bucket is passed to the every lambda fn in the ServiceStack
    const {
      productService,
      categoryService,
      dealsService,
      imageService,
      queueService
    } = new ServiceStack(this, "ProductService", {
      bucket: bucket.bucketName
    });

    // But only the imageService is granted write access to the bucket
    bucket.grantReadWrite(imageService);

    new ApiGatewayStack(this, "ProductApiGayeway", {
      productService,
      categoryService,
      dealsService,
      imageService,
      queueService
    });
  }
}
