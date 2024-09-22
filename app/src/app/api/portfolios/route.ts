import { NextResponse } from "next/server";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { getDbClient } from "@/app/lib/db";

export async function GET() {
    const chatGptPortfolio = await getDbClient().send(new GetItemCommand({
        TableName: "TradingTable",
        Key: {
            "PK": { S: "PORTFOLIO#CHATGPT" },
            "SK": { S: "LATEST" }
        }
    })).catch((error) => {
        console.error("Error fetching chatGptPortfolio: ", error);
    });

    const monkeyPortfolio = await getDbClient().send(new GetItemCommand({
        TableName: "TradingTable",
        Key: {
            "PK": { S: "PORTFOLIO#MONKEY" },
            "SK": { S: "LATEST" }
        }
    })).catch((error) => {
        console.error("Error fetching monkeyPortfolio: ", error);
    });

    if (!chatGptPortfolio || !monkeyPortfolio) {
        return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
    }

    return NextResponse.json({
        chatGptPortfolio: unmarshall(chatGptPortfolio?.Item),
        monkeyPortfolio: unmarshall(monkeyPortfolio?.Item)
    });
}
