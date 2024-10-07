import os
import boto3
from decimal import Decimal
from datetime import datetime
from lib.fin import Portfolio, Position, Instrument, Trade
from typing import Optional

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TRADING_TABLE_NAME'])

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
            'balance': Decimal(str(portfolio.balance)),
            'positions': [{'symbol': p.instrument.symbol, 'name': p.instrument.name, 'quantity': p.quantity, 'price': Decimal(str(p.price))} for p in portfolio.positions]
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
            'SK': date.date().isoformat(),  # Use only the date part
            'timestamp': date.isoformat(),  # Add a timestamp for tracking the latest valuation
            'value': Decimal(str(value))  # Convert float to Decimal
        }
    )

def load_portfolio_valuation(trader_type: str, date: datetime) -> Optional[float]:
    print(f"Loading portfolio valuation for {trader_type} on {date}")
    response = table.get_item(
        Key={
            'PK': f'VALUATION#{trader_type.upper()}',
            'SK': date.date().isoformat()
        }
    )
    if 'Item' in response:
        return float(response['Item']['value'])
