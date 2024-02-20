import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";

// Product service lambda handler function
export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(`EVENT: ${JSON.stringify(event)}`);
  console.log(`CONTEXT: ${JSON.stringify(context)}`);
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "This is the deals service!",
      path: `${event.path}, ${event.pathParameters}`
    })
  };
};
