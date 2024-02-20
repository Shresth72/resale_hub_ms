import { APIGatewayEvent, APIGatewayProxyResult, Context } from "aws-lambda";
import { S3 } from "aws-sdk";
import { v4 as uuid } from "uuid";
import { bucket_name } from "./utility/config";
import { ErrorResponse } from "./utility/response";

const s3Client = new S3();

// Product service lambda handler function
export const handler = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  try {
    // grab the filename from the query string
    const file = event.queryStringParameters?.file;

    // give unique name to the file
    const fileName = `${uuid()}__${file}`;
    const fileType = fileName.split(".").pop();

    // create a S3Params
    const s3Params = {
      Bucket: bucket_name,
      Key: fileName,
      ContentType: `image/${fileType}`
    };

    // get Signed URL
    const url = await s3Client.getSignedUrlPromise("putObject", s3Params);

    // give it back to client for uploading the file
    return {
      statusCode: 200,
      body: JSON.stringify({
        url,
        Key: fileName
      })
    };
  } catch (error) {
    return ErrorResponse(500, error);
  }
};
