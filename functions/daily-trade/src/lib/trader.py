# This is an interface for what a trader should look like

from abc import ABC, abstractmethod
from .fin import Trade, Market, Portfolio, Instrument
import random
from typing import Optional, List
from .ai import generate_ai_trade
from enum import Enum

class Action(Enum):
    BUY = 'buy'
    SELL = 'sell'
    HOLD = 'hold'

class Trader(ABC):

    initial_cash = 10000

    def __init__(self, market: Market, portfolio: Portfolio):
        self.market = market
        self.portfolio = portfolio

    @abstractmethod
    def generate_trade(self) -> Optional[Trade]:
        pass


class MonkeyTrader(Trader):
    def __init__(self, market, portfolio):
        super().__init__(market, portfolio)
        self.possible_actions: List[Action] = list(Action)

    def generate_trade(self) -> Optional[Trade]:
        action = self._choose_action()
        print("Monkey trader is planning to " + action.value)
        if action.value == Action.BUY.value:
            return self._generate_buy_trade()
        elif action.value == Action.SELL.value:
            return self._generate_sell_trade()
        else:
            return None

    def _choose_action(self) -> Action:
        if not self.portfolio.positions or len(self.portfolio.positions) == 0:
            print("No positions in Portfolio, defaulting to BUY")
            return Action.BUY
        return random.choice(self.possible_actions)

    def _generate_buy_trade(self) -> Trade:
        instrument = self._choose_random_instrument()
        price = self.market.prices[instrument.symbol]
        print("Monkey trader is planning to buy " + instrument.symbol + " at " + str(price))
        return Trade(instrument=instrument, quantity=1, price=price)

    def _generate_sell_trade(self) -> Optional[Trade]:
        if not self.portfolio.positions:  # Contains more than just cash
            return None
        position = random.choice(self.portfolio.positions)
        price = self.market.prices[position.instrument.symbol]
        return Trade(instrument=position.instrument, quantity=-1, price=price)

    def _choose_random_instrument(self) -> Instrument:
        symbol = random.choice(list(self.market.prices.keys()))
        return Instrument(symbol=symbol, name='')

class ChatGPTTrader(Trader):

    def generate_trade(self) -> Optional[Trade]:
        return generate_ai_trade(self.market, self.portfolio)
