from dataclasses import dataclass, field
from typing import List
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

@dataclass
class Position:
    instrument: Instrument
    quantity: int
    price: float

@dataclass
class Portfolio:
    positions: List[Position] = field(default_factory=list)

    def add(self, trade: Trade):
        if trade.quantity <= 0:
            raise ValueError("Trade quantity must be positive")

        for position in self.positions:
            if position.instrument == trade.instrument:
                total_quantity = position.quantity + trade.quantity
                position.price = (position.price * position.quantity + trade.price * trade.quantity) / total_quantity
                position.quantity = total_quantity
                return

        self.positions.append(Position(instrument=trade.instrument, quantity=trade.quantity, price=trade.price))

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
