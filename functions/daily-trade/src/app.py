import json
import logging
from datetime import datetime
from lib.data import load_market_data
from lib.fin import calculate_portfolio_value
from lib.trader import ChatGPTTrader, MonkeyTrader, initial_cash
from lib.db import save_trade, save_portfolio, save_portfolio_valuation, load_portfolio, load_portfolio_valuation
from pytz import timezone

logging.basicConfig(level=logging.INFO)

def is_market_open():
    return (13 <= datetime.now(timezone('UTC')).hour < 22) and (datetime.now(timezone('UTC')).weekday() < 5)

def is_rebalance_needed(trader1, trader2):
   current_datetime = datetime.now(timezone('UTC'))
   is_first_tick_of_the_week = current_datetime.weekday() == 0 and not load_portfolio_valuation('chatgpt', current_datetime)
   empty_portfolio = not trader1.portfolio.positions and not trader2.portfolio.positions
   return is_first_tick_of_the_week or empty_portfolio

def initialize_traders(market):
    chatgpt_portfolio = load_portfolio('chatgpt')
    monkey_portfolio = load_portfolio('monkey')
    return (
        ChatGPTTrader(market, chatgpt_portfolio),
        MonkeyTrader(market, monkey_portfolio)
    )

def execute_trades(trader, portfolio, market):
    trade = trader.generate_trade()
    if trade:
        portfolio.add(trade)
        save_trade(trader.__class__.__name__.lower(), trade, market.date)
    return trade

def update_portfolio(trader_name, portfolio, market):
    value = calculate_portfolio_value(portfolio, market)
    save_portfolio_valuation(trader_name, value, market.date)
    save_portfolio(trader_name, portfolio)
    return value

def main():
    """
    Main function to run the trading comparison between ChatGPT and Monkey traders every 3 hours when the market is open.
    """
    try:
        if not is_market_open():
            return {
                "statusCode": 200,
                "body": json.dumps({"message": "Market is closed. No trading performed."})
            }

        market = load_market_data()
        chatgpt_trader, monkey_trader = initialize_traders(market)


        if is_rebalance_needed(chatgpt_trader, monkey_trader):
            print("Rebalancing portfolios...")
            chatgpt_trader.rebalance()
            monkey_trader.rebalance()
        else:
            print("Executing daily trades")
            execute_trades(chatgpt_trader, chatgpt_trader.portfolio, market) if chatgpt_trader.portfolio.positions else None
            execute_trades(monkey_trader, monkey_trader.portfolio, market) if monkey_trader.portfolio.positions else None

        update_portfolio('chatgpt', chatgpt_trader.portfolio, market)
        update_portfolio('monkey', monkey_trader.portfolio, market)

        print("Trading complete")

        return {
            "statusCode": 200
        }

    except Exception as e:
        logging.error(f"Error in lambda_handler: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
        }

def lambda_handler(event, context):
    return main()
