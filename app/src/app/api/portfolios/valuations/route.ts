import { NextResponse } from "next/server";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { getDbClient } from "@/app/lib/db";

export async function GET() {
    // TODO Implement (load all historical valuations for both portfolios)
}
