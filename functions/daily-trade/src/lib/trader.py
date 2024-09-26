# This is an interface for what a trader should look like

from abc import ABC, abstractmethod
from .fin import Trade, Market, Portfolio, Instrument
import random
from typing import Optional
from .ai import generate_ai_trade
from enum import Enum

class Action(Enum):
    BUY = 'buy'
    SELL = 'sell'
    HOLD = 'hold'

class Trader(ABC):

    initial_cash = 5000

    def __init__(self, market: Market, portfolio: Portfolio):
        self.market = market
        self.portfolio = portfolio

    @abstractmethod
    def generate_trade(self) -> Optional[Trade]:
        pass


class MonkeyTrader(Trader):
    def __init__(self, market: Market, portfolio: Portfolio):
        super().__init__(market, portfolio)
        self.possible_actions = [Action.BUY, Action.SELL]
        self.buy_probability = 0.7  # 70% probability for buy

    def generate_trade(self) -> Optional[Trade]:
        action = self._choose_action()
        print("Monkey trader is planning to " + action.value)
        if action == Action.BUY:
            return self._generate_buy_trade()
        elif action == Action.SELL:
            return self._generate_sell_trade()
        else:
            return None

    def _choose_action(self) -> Action:
        return Action.BUY if random.random() < self.buy_probability else Action.SELL

    def _generate_buy_trade(self) -> Trade:
        symbol = random.choice(list(self.market.prices.keys()))
        name = self.market.names.get(symbol, "Unknown")  # Get the name from market data
        instrument = Instrument(symbol, name)
        price = self.market.prices[instrument.symbol]
        print("Monkey trader is planning to buy " + instrument.symbol + " at " + str(price))
        return Trade(instrument=instrument, quantity=1, price=price)

    def _generate_sell_trade(self) -> Optional[Trade]:
        if not self.market.prices:  # If there are no prices in the market
            return None
        symbol = random.choice(list(self.market.prices.keys()))
        name = self.market.names.get(symbol, "Unknown")  # Get the name from market data
        instrument = Instrument(symbol, name)
        price = self.market.prices[symbol]
        return Trade(instrument=instrument, quantity=-1, price=price)

    def _choose_random_instrument(self) -> Instrument:
        symbol = random.choice(list(self.market.prices.keys()))
        name = self.market.names.get(symbol, "Unknown")  # Get the name from market data
        return Instrument(symbol, name)

class ChatGPTTrader(Trader):

    def generate_trade(self) -> Optional[Trade]:
        return generate_ai_trade(self.market, self.portfolio)
