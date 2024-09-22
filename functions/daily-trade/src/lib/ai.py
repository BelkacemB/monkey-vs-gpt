from openai import OpenAI
from dotenv import load_dotenv
import os
from .fin import Market, Portfolio, Trade
import json
from typing import Optional

load_dotenv()
API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=API_KEY)

def generate_ai_trade(market: Market, portfolio: Portfolio) -> Optional[Trade]:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": "You are a trader in the stock market. You have started with $10000 in cash. You must beat a rival trader over a period of one month. You are allowed one trade per day, and the maximum cash you can invest per day is 500$. You can buy any asset from the S&P 500 stocks. You can sell anything you have on your portfolio, and you can hold (do nothing)."
                    }
                ]
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": f"Given a portfolio of: {str(portfolio)}\n\nAnd given the latest stock market news: {market.news}\n\nAnd knowing you are allowed to buy any stock from the S&P 500 and sell anything on your portfolio\n\nGenerate a trade and explain it, in JSON format of {{symbol: ..., action: ..., explanation: ...}} \nAction is 1 for buy, -1 for sell\nIf there is no interesting trade to make, return an empty json object"
                    }
                ]
            }
        ],
        temperature=1,
        max_tokens=2048,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        response_format={
            "type": "json_object"
        }
    )

    trade_data = json.loads(response['choices'][0]['message']['content'])
    if trade_data:
        return Trade(symbol=trade_data['symbol'], quantity=trade_data['action'], explanation=trade_data['explanation'])
    else:
        return None