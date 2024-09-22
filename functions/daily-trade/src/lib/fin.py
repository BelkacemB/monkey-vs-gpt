from dataclasses import dataclass, field
from typing import List, Optional
from datetime import datetime
from decimal import Decimal

@dataclass
class Instrument:
    symbol: str
    name: Optional[str] = None

    def __eq__(self, other):
        if isinstance(other, Instrument):
            return self.symbol == other.symbol
        return False

    def __hash__(self):
        return hash(self.symbol)

@dataclass
class Trade:
    instrument: Instrument
    quantity: int
    price: float
    explanation: Optional[str] = None

@dataclass
class Position:
    instrument: Instrument
    quantity: int
    price: float

class Portfolio:
    positions: List[Position]
    balance: float

    def __init__(self, positions=None, balance=None):
        self.positions = positions or []
        self.balance = balance or 10000

    def add(self, trade: Trade):
        print(f"Adding trade to portfolio: {trade}")
        trade_cost = Decimal(trade.price) * Decimal(trade.quantity)  # Convert to Decimal

        # Check if there is enough cash for the trade
        if trade_cost > Decimal(self.balance):  # Convert balance to Decimal
            raise ValueError("Insufficient cash for the trade")

        for position in self.positions:
            if position.instrument == trade.instrument:
                total_quantity = position.quantity + trade.quantity
                if total_quantity == 0:
                    self.positions.remove(position)
                else:
                    position.price = (Decimal(position.price) * Decimal(position.quantity) + Decimal(trade.price) * Decimal(trade.quantity)) / Decimal(total_quantity)  # Convert to Decimal
                    position.quantity = total_quantity
                self.balance -= trade_cost
                return

        self.positions.append(Position(instrument=trade.instrument, quantity=trade.quantity, price=trade.price))
        self.balance -= trade_cost
        print(f"Added trade to portfolio: {trade}")

    def __str__(self):
        return '\n'.join([f'{position.instrument.symbol}: {position.quantity} @ {position.price:.2f}' for position in self.positions])

    def __repr__(self):
        return str(self)

@dataclass
class Market:
    # A map of symbol to price
    prices: dict
    news: List[str] = field(default_factory=list)
    date: datetime = datetime.now()
    names: dict = field(default_factory=dict)
