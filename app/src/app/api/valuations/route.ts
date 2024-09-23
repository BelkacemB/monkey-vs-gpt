import { NextResponse } from "next/server";
import { ScanCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { getDbClient } from "@/app/lib/db";

async function getAllValuations(traderType: string) {
    const response = await getDbClient().send(new ScanCommand({
        TableName: "TradingTable",
        FilterExpression: "begins_with(PK, :pk)",
        ExpressionAttributeValues: {
            ":pk": { S: `VALUATION#${traderType.toUpperCase()}` }
        }
    }));
    return response.Items ? response.Items.map(item => unmarshall(item)) : [];
}

export async function GET() {
    // Fetch all valuations for both traders
    const monkeyValuations = await getAllValuations('monkey');
    const chatGptValuations = await getAllValuations('chatgpt');

    return NextResponse.json({
        monkeyValuations,
        chatGptValuations
    });
}
