import pytest
from unittest.mock import patch
from src.lib import trader as t
from src.lib.fin import Market, Portfolio, Trade, Instrument, Position

@pytest.fixture
def market():
    return Market(
        prices={'AAPL': 150.0, 'GOOGL': 2500.0, 'MSFT': 300.0},
        news=["Some market news"]
    )

@pytest.fixture
def portfolio():
    return Portfolio(
        positions=[
            Position(instrument=Instrument(symbol='CASH', name='Cash'), quantity=9000, price=1.0),
            Position(instrument=Instrument(symbol='AAPL', name='Apple Inc.'), quantity=10, price=150.0)
        ],
        balance=10000
    )

class TestChatGPTTrader:
    @patch('src.lib.trader.generate_ai_trade')
    def test_generate_trade(self, mock_generate_ai_trade, market, portfolio):
        mock_trade = Trade(instrument=Instrument(symbol='GOOGL', name='Google Inc.'), quantity=1, price=2500.0)
        mock_generate_ai_trade.return_value = mock_trade

        trader = t.ChatGPTTrader(market, portfolio)
        trade = trader.generate_trade()

        assert trade == mock_trade
        mock_generate_ai_trade.assert_called_once_with(market, portfolio)

    @patch('src.lib.trader.generate_ai_trade')
    def test_generate_trade_no_trade(self, mock_generate_ai_trade, market, portfolio):
        mock_generate_ai_trade.return_value = None

        trader = t.ChatGPTTrader(market, portfolio)
        trade = trader.generate_trade()

        assert trade is None
        mock_generate_ai_trade.assert_called_once_with(market, portfolio)

class TestMonkeyTrader:
    def test_generate_trade_buy(self, market, portfolio):
        with patch('random.choice') as mock_choice:
            mock_choice.side_effect = ['buy', 'AAPL']
            trader = t.MonkeyTrader(market, portfolio)
            trade = trader.generate_trade()

            assert trade is not None
            assert trade.instrument.symbol == 'AAPL'
            assert trade.quantity == 1
            assert trade.price == 150.0

    def test_generate_trade_sell(self, market, portfolio):
        with patch('random.choice') as mock_choice:
            mock_choice.side_effect = ['sell', portfolio.positions[1]]

            trader = t.MonkeyTrader(market, portfolio)
            trade = trader.generate_trade()

            assert trade is not None
            assert trade.instrument.symbol == 'AAPL'
            assert trade.quantity == -1
            assert trade.price == 150.0

    def test_generate_trade_hold(self, market, portfolio):
        with patch('random.choice') as mock_choice:
            mock_choice.return_value = 'hold'
            trader = t.MonkeyTrader(market, portfolio)
            trade = trader.generate_trade()

            assert trade is None

    def test_generate_trade_sell_only_cash(self, market):
        portfolio = Portfolio(
            positions=[],
            balance=10000
        )
        with patch('random.choice') as mock_choice:
            mock_choice.side_effect = ['sell']
            trader = t.MonkeyTrader(market, portfolio)
            trade = trader.generate_trade()

            assert trade is None