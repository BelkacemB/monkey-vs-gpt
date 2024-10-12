import yahooFinance from "yahoo-finance2";
import { NextResponse } from 'next/server';

export async function GET() {
    console.log('Fetching S&P 500 data...');

    try {
        const data = await yahooFinance.historical('^GSPC', {
            period1: "2024-10-02",
        });

        // Ensure the data matches our StockData type
        const result: StockData[] = data.map(item => ({
            date: item.date.toISOString(),
            high: item.high,
            volume: item.volume,
            open: item.open,
            low: item.low,
            close: item.close,
        }));

        return NextResponse.json(result, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Content-Type",
            },
        });
    } catch (error) {
        console.error('Error fetching stock data:', error);
        return NextResponse.json({ error: 'Failed to fetch stock data' }, { status: 500 });
    }
}
