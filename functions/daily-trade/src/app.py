import json
import logging
import os
import boto3
from datetime import datetime
from lib.data import load_market_data
from lib.fin import Portfolio, Instrument, Position, Trade, Market
from lib.trader import ChatGPTTrader, MonkeyTrader
from decimal import Decimal

logging.basicConfig(level=logging.INFO)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TRADING_TABLE_NAME'])

def lambda_handler(event, context):
    """
    Main function to run the daily trading comparison between ChatGPT and Monkey traders.
    """
    try:
        # Load market data
        market = load_market_data()

        # Initialize portfolios
        print("Loading portfolios...")
        chatgpt_portfolio = load_portfolio('chatgpt')
        monkey_portfolio = load_portfolio('monkey')

        # Initialize traders
        print("Initializing traders...")
        chatgpt_trader = ChatGPTTrader(market, chatgpt_portfolio)
        monkey_trader = MonkeyTrader(market, monkey_portfolio)

        # Generate and execute trades
        print("Generating trades...")
        chatgpt_trade = chatgpt_trader.generate_trade()
        monkey_trade = monkey_trader.generate_trade()

        print("Executing trades...")
        if chatgpt_trade:
            chatgpt_portfolio.add(chatgpt_trade)
            save_trade('chatgpt', chatgpt_trade, market.date)

        if monkey_trade:
            monkey_portfolio.add(monkey_trade)
            save_trade('monkey', monkey_trade, market.date)

        # Calculate portfolio values
        print("Calculating portfolio values...")
        chatgpt_value = calculate_portfolio_value(chatgpt_portfolio, market)
        monkey_value = calculate_portfolio_value(monkey_portfolio, market)

        # Save portfolio valuations
        print("Saving portfolio valuations...")
        save_portfolio_valuation('chatgpt', chatgpt_value, market.date)
        save_portfolio_valuation('monkey', monkey_value, market.date)

        # Save updated portfolios
        print("Updating portfolios...")
        save_portfolio('chatgpt', chatgpt_portfolio)
        save_portfolio('monkey', monkey_portfolio)

        # Prepare result
        result = {
            "date": market.date.isoformat(),
            "chatgpt_portfolio": {
                "value": chatgpt_value,
                "trade": str(chatgpt_trade) if chatgpt_trade else "No trade"
            },
            "monkey_portfolio": {
                "value": monkey_value,
                "trade": str(monkey_trade) if monkey_trade else "No trade"
            }
        }

        print("Daily trading complete")

        return {
            "statusCode": 200
        }
    except Exception as e:
        logging.error(f"Error in lambda_handler: {str(e)}")
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)}),
        }

def calculate_portfolio_value(portfolio: Portfolio, market: Market) -> Decimal:
    total_value = Decimal(str(portfolio.balance))
    for position in portfolio.positions:
        if position.instrument.symbol in market.prices:
            total_value += Decimal(str(position.quantity)) * Decimal(str(market.prices[position.instrument.symbol]))
    return total_value

def load_portfolio(trader_type: str) -> Portfolio:
    response = table.get_item(
        Key={
            'PK': f'PORTFOLIO#{trader_type.upper()}',
            'SK': 'LATEST'
        }
    )
    if 'Item' in response:
        item = response['Item']
        positions = [Position(Instrument(p['symbol'], p['name']), p['quantity'], p['price']) for p in item['positions']]
        return Portfolio(positions, item['balance'])
    return Portfolio(balance=10000)  # Default initial portfolio

def save_portfolio(trader_type: str, portfolio: Portfolio):
    table.put_item(
        Item={
            'PK': f'PORTFOLIO#{trader_type.upper()}',
            'SK': 'LATEST',
            'balance': Decimal(portfolio.balance),  # Convert to Decimal
            'positions': [{'symbol': p.instrument.symbol, 'name': p.instrument.name, 'quantity': p.quantity, 'price': Decimal(p.price)} for p in portfolio.positions]  # Convert price to Decimal
        }
    )

def save_trade(trader_type: str, trade: Trade, date: datetime):
    print(f"Saving trade for {trader_type}: {trade}")
    table.put_item(
        Item={
            'PK': f'TRADE#{trader_type.upper()}',
            'SK': date.isoformat(),
            'symbol': trade.instrument.symbol,
            'quantity': Decimal(trade.quantity),  # Convert to Decimal
            'price': Decimal(trade.price),  # Convert to Decimal
            'explanation': trade.explanation
        }
    )

def save_portfolio_valuation(trader_type: str, value: float, date: datetime):
    print(f"Saving portfolio valuation for {trader_type}: {value}")
    table.put_item(
        Item={
            'PK': f'VALUATION#{trader_type.upper()}',
            'SK': date.isoformat(),
            'value': Decimal(str(value))  # Convert float to Decimal
        }
    )
