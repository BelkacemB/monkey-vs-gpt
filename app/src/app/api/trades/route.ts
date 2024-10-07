import { NextResponse } from "next/server";
import { QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { getDbClient } from "@/app/lib/db";

export async function GET() {
    const gptTrades = await fetchTrades("TRADE#CHATGPTTRADER");
    const monkeyTrades = await fetchTrades("TRADE#MONKEYTRADER");

    if (!gptTrades || !monkeyTrades) {
        return NextResponse.json({ error: "Trades not found" }, { status: 404 });
    }

    return NextResponse.json(
        {
            gptTrades,
            monkeyTrades
        },
        {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
            },
        }
    );
}

async function fetchTrades(pk: string) {
    const response = await getDbClient().send(new QueryCommand({
        TableName: "TradingTable",
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: {
            ":pk": { S: pk }
        }
    })).catch((error) => {
        console.error(`Error fetching trades for ${pk}: `, error);
    });

    if (response && response.Items) {
        return response.Items.map(item => unmarshall(item));
    }
    return null;
}
