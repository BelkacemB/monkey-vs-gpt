from openai import OpenAI
import os
from .fin import Market, Portfolio, Trade, Instrument
import json
from typing import Optional

API_KEY = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=API_KEY)


def generate_ai_trade(market: Market, portfolio: Portfolio) -> Optional[Trade]:
    held_instruments = [position.instrument.symbol for position in portfolio.positions]
    portfolio_prices = {
        instrument: market.prices[instrument]
        for instrument in held_instruments
    }

    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {
                "role": "system",
                "content": [
                    {
                        "type": "text",
                        "text": "You are a trader in the stock market. You have started with $5000 in cash. You must beat a rival trader over a period of one month. You are allowed one trade per day, and the maximum cash you can invest per day is 500$. You can buy any asset from the S&P 500 stocks. You can sell anything you have on your portfolio, and you can hold (do nothing). If you have a short position of -N quantity you want to cancel, you should just buy +N quantity of that stock.",
                    }
                ],
            },
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": (
                            f"Given a portfolio of: {str(portfolio)}\n\n"
                            f"And given the latest stock market news: {market.news}\n\n"
                            f"And knowing you are allowed to buy any stock from the S&P 500 and sell anything (including short selling)\n\n"
                            f"And the latest prices of the assets that you already own: {portfolio_prices}\n\n"
                            "Generate a trade and explain it, in JSON format of "
                            "{{symbol: ..., action: ..., explanation: ...}} \n"
                            f"The symbol must be one of the following: {market.prices.keys()}\n"
                            "Action is 1 for buy, -1 for sell\n"
                            "If there is no interesting trade to make, return an empty json object"
                        ),
                    }
                ],
            },
        ],
        temperature=1,
        max_tokens=2048,
        top_p=1,
        frequency_penalty=0,
        presence_penalty=0,
        response_format={"type": "json_object"},
    )

    # Access the response correctly
    trade_data = json.loads(response.choices[0].message.content)
    print("generated_trade", trade_data)
    if trade_data and trade_data["symbol"] in market.prices.keys():
        return Trade(
            instrument=Instrument(symbol=trade_data["symbol"]),
            quantity=trade_data["action"],
            explanation=trade_data["explanation"],
            price=market.prices[trade_data["symbol"]],
        )
    else:
        return None
