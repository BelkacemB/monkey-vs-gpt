from dataclasses import dataclass, field
from typing import List, Optional
from datetime import datetime

@dataclass
class Instrument:
    symbol: str
    name: str

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

@dataclass
class Portfolio:
    positions: List[Position] = field(default_factory=list)
    balance: float = 10000

    class Portfolio:
        def __init__(self):
            self.positions = []
            self.balance = 10000  # Initial cash balance, adjust as needed

        def add(self, trade: Trade):
            trade_cost = trade.price * trade.quantity

            # Check if there is enough cash for the trade
            if trade_cost > self.cash_balance:
                raise ValueError("Insufficient cash for the trade")

            for position in self.positions:
                if position.instrument == trade.instrument:
                    total_quantity = position.quantity + trade.quantity
                    position.price = (position.price * position.quantity + trade.price * trade.quantity) / total_quantity
                    position.quantity = total_quantity
                    self.cash_balance -= trade_cost
                    return

            self.positions.append(Position(instrument=trade.instrument, quantity=trade.quantity, price=trade.price))
            self.cash_balance -= trade_cost

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
