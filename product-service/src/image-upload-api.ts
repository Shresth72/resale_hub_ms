import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { S3 } from "aws-sdk";
import { v4 as uuid } from "uuid";

// Product service lambda handler function
export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  // grab the filename from the query string
  const file = event.queryStringParameters?.file;

  // give unique name to the file
  const fileName = `${uuid()}__${file}`;

  // create a S3Params
  const s3Params = {
    Bucket: process.env.BUCKET_NAME || "",
    Key: fileName,
    Expires: 60,
    ContentType: "image/jpeg",
    ACL: "public-read"
  };

  // get Signed URL

  // give it back to client for uploading the file

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "This is the image upload service!",
      path: `${event.path}, ${event.pathParameters}`
    })
  };
};
