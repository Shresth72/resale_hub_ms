import * as cdk from "aws-cdk-lib";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import {
  NodejsFunction,
  NodejsFunctionProps
} from "aws-cdk-lib/aws-lambda-nodejs";
import { SubscriptionFilter, Topic } from "aws-cdk-lib/aws-sns";
import { SqsSubscription } from "aws-cdk-lib/aws-sns-subscriptions";
import { Queue } from "aws-cdk-lib/aws-sqs";
import { Construct } from "constructs";
import { join } from "path";

export class TransactionServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // create an order queue with a visibility timeout of 5 minutes
    const orderQueue = new Queue(this, "order_queue", {
      visibilityTimeout: cdk.Duration.seconds(300)
    });

    // getting reference to the customer topic from the customer/user service stack
    const orderTopic = Topic.fromTopicArn(
      this,
      "order-consume-topic",
      cdk.Fn.importValue("customer-topic")
    );

    // add a subscription to the order topic, listen only for place_order actionType
    orderTopic.addSubscription(
      new SqsSubscription(orderQueue, {
        rawMessageDelivery: true,
        filterPolicy: {
          actionType: SubscriptionFilter.stringFilter({
            allowlist: ["place_order"]
          })
        }
      })
    );

    // handler
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: ["aws-sdk"]
      },
      runtime: Runtime.NODEJS_16_X,
      timeout: cdk.Duration.seconds(30)
    };

    const createOrderHandler = new NodejsFunction(
      this,
      "create_order_handler",
      {
        ...nodeJsFunctionProps,
        entry: join(__dirname, "/..src/order/create.ts")
      }
    );

    // Adding Add Event Resource to the order_queue
    createOrderHandler.addEventSource(new SqsEventSource(orderQueue));
  }
}
