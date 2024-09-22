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



class Portfolio:
    positions: List[Position]
    balance: float

    def __init__(self, positions=None, balance=None):
        self.positions = positions or []
        self.balance = balance or 10000

    def add(self, trade: Trade):
        trade_cost = trade.price * trade.quantity

        # Check if there is enough cash for the trade
        if trade_cost > self.balance:
            raise ValueError("Insufficient cash for the trade")

        for position in self.positions:
            if position.instrument == trade.instrument:
                total_quantity = position.quantity + trade.quantity
                if total_quantity == 0:
                    self.positions.remove(position)
                else:
                    position.price = (position.price * position.quantity + trade.price * trade.quantity) / total_quantity
                    position.quantity = total_quantity
                self.balance -= trade_cost
                return

        self.positions.append(Position(instrument=trade.instrument, quantity=trade.quantity, price=trade.price))
        self.balance -= trade_cost

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
