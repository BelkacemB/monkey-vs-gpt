/* eslint-disable @typescript-eslint/no-explicit-any */
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

let dbClientInstance: DynamoDBClient;

export const getDbClient = () => {
    if (!dbClientInstance) {
        dbClientInstance = new DynamoDBClient({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_ACCESS_SECRET
            },
        });
    }
    return dbClientInstance;
};
