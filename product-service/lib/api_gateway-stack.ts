import { aws_apigateway } from "aws-cdk-lib";
import {
  LambdaIntegration,
  LambdaRestApi,
  RestApi
} from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

interface ApiGatewayStackProps {
  productService: IFunction;
  categoryService: IFunction;
  dealsService: IFunction;
  imageService: IFunction;
  queueService: IFunction;
}

interface ResourceType {
  name: string;
  methods: string[];
  child?: ResourceType;
}

export class ApiGatewayStack extends Construct {
  constructor(scope: Construct, id: string, props: ApiGatewayStackProps) {
    super(scope, id);
    this.addResource("product", props);
  }

  addResource(
    serviceName: string,
    {
      productService,
      categoryService,
      dealsService,
      imageService,
      queueService
    }: ApiGatewayStackProps
  ) {
    const apigw = new aws_apigateway.RestApi(this, `${serviceName}-ApiGtw`);

    this.createEndPoints(productService, apigw, {
      name: "product",
      methods: ["GET", "POST"],
      child: {
        name: "{id}",
        methods: ["GET", "PUT", "DELETE"]
      }
    });

    this.createEndPoints(categoryService, apigw, {
      name: "category",
      methods: ["GET", "POST"],
      child: {
        name: "{id}",
        methods: ["GET", "PUT", "DELETE"]
      }
    });

    this.createEndPoints(dealsService, apigw, {
      name: "deals",
      methods: ["GET", "POST"],
      child: {
        name: "{id}",
        methods: ["GET", "PUT", "DELETE"]
      }
    });

    // To upload image to the signed URL use Put method
    this.createEndPoints(imageService, apigw, {
      name: "uploader",
      methods: ["GET"]
    });

    this.createEndPoints(queueService, apigw, {
      name: "products-queue",
      methods: ["POST"]
    });
  }

  createEndPoints(
    handler: IFunction,
    resource: RestApi,
    { name, methods, child }: ResourceType
  ) {
    const lambdaFunction = new LambdaIntegration(handler);
    const rootResource = resource.root.addResource(name);
    methods.map((item) => {
      rootResource.addMethod(item, lambdaFunction);
    });

    if (child) {
      const childResource = rootResource.addResource(child.name);
      child.methods.map((item) => {
        childResource.addMethod(item, lambdaFunction);
      });
    }
  }
}
