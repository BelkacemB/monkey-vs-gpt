# This is an interface for what a trader should look like

from abc import ABC, abstractmethod
from .fin import Trade, Market, Portfolio, Instrument
import random
from typing import Optional, List
import math
from .ai import generate_ai_trade, generate_ai_initial_selection
from enum import Enum

initial_cash = 10000

class Action(Enum):
    BUY = 'buy'
    SELL = 'sell'
    HOLD = 'hold'

class Trader(ABC):

    def __init__(self, market: Market, portfolio: Portfolio):
        self.market = market
        self.portfolio = portfolio

    @abstractmethod
    def generate_trade(self) -> Optional[Trade]:
        pass

    @abstractmethod
    def rebalance(self, init: bool = False):
        pass

    @abstractmethod
    def initial_selection(self) -> List[Instrument]:
        pass

    def round_quantity(self, cash: float, price: float) -> int:
        return math.floor(cash / price)

    def _liquidate_holdings(self):
        positions_to_liquidate = self.portfolio.positions.copy()
        for holding in positions_to_liquidate:
            trade = Trade(instrument=holding.instrument, quantity=-holding.quantity, price=self.market.prices[holding.instrument.symbol])
            self.portfolio.add(trade)

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
        owned_stocks = [holding.instrument for holding in self.portfolio.positions if holding.quantity > 0]
        if not owned_stocks:
            return None
        instrument = random.choice(owned_stocks)
        price = self.market.prices[instrument.symbol]
        quantity = -1
        return Trade(instrument=instrument, quantity=quantity, price=price)

    def _choose_random_instrument(self) -> Instrument:
        symbol = random.choice(list(self.market.prices.keys()))
        name = self.market.names.get(symbol, "Unknown")  # Get the name from market data
        return Instrument(symbol, name)

    def initial_selection(self) -> List[Instrument]:
        available_symbols = list(self.market.prices.keys())
        selected_symbols = random.sample(available_symbols, min(30, len(available_symbols)))
        return [Instrument(symbol, self.market.names.get(symbol, "Unknown")) for symbol in selected_symbols]

    def rebalance(self):
        self._liquidate_holdings()
        selected_instruments = self.initial_selection()
        cash_per_stock = initial_cash / len(selected_instruments)
        for instrument in selected_instruments:
            quantity = self.round_quantity(cash_per_stock, self.market.prices[instrument.symbol])
            if quantity > 0:
                trade = Trade(instrument=instrument, quantity=quantity, price=self.market.prices[instrument.symbol])
                self.portfolio.add(trade)

class ChatGPTTrader(Trader):

    def generate_trade(self) -> Optional[Trade]:
        return generate_ai_trade(self.market, self.portfolio)

    def initial_selection(self) -> List[Instrument]:
        return generate_ai_initial_selection(self.market)

    def rebalance(self):
        self._liquidate_holdings()
        selected_instruments = self.initial_selection()
        cash_per_stock = initial_cash / len(selected_instruments)
        for instrument in selected_instruments:
            quantity = self.round_quantity(cash_per_stock, self.market.prices[instrument.symbol])
            if quantity > 0:
                trade = Trade(instrument=instrument, quantity=quantity, price=self.market.prices[instrument.symbol])
                self.portfolio.add(trade)
