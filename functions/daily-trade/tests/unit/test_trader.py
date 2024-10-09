import pytest
from unittest.mock import patch, MagicMock
from decimal import Decimal
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
    @patch('random.random')
    @patch('random.choice')
    def test_generate_trade_buy(self, mock_choice, mock_random, market, portfolio):
        mock_random.return_value = 0.5  # This will trigger a buy action (< 0.7)
        mock_choice.return_value = 'AAPL'

        trader = t.MonkeyTrader(market, portfolio)
        trade = trader.generate_trade()

        assert trade is not None
        assert trade.instrument.symbol == 'AAPL'
        assert trade.quantity == 1
        assert trade.price == 150.0

        mock_random.assert_called_once()
        mock_choice.assert_called_once_with(list(market.prices.keys()))

    @patch('random.random')
    @patch('random.choice')
    def test_generate_trade_sell(self, mock_choice, mock_random, market, portfolio):
        mock_random.return_value = 0.8  # This will trigger a sell action (> 0.7)
        mock_choice.return_value = Instrument(symbol='AAPL', name='Apple')

        trader = t.MonkeyTrader(market, portfolio)
        trade = trader.generate_trade()

        assert trade is not None
        assert trade.instrument.symbol == 'AAPL'
        assert trade.quantity == -1
        assert trade.price == 150.0


    def test_generate_trade_sell_only_cash(self, market):
        portfolio = Portfolio(
            positions=[],
            balance=10000
        )
        with patch('random.random') as mock_choice:
            mock_choice.return_value = 0.8
            trader = t.MonkeyTrader(market, portfolio)
            trade = trader.generate_trade()

            assert trade is None

    @patch('random.sample')
    def test_rebalance(self, mock_sample, market, portfolio):
        # Setup initial portfolio with some positions
        initial_positions = [
            Position(instrument=Instrument('AAPL', 'Apple Inc.'), quantity=10, price=150.0),
            Position(instrument=Instrument('GOOGL', 'Alphabet Inc.'), quantity=5, price=2500.0),
        ]
        portfolio.positions = initial_positions
        portfolio.balance = Decimal('1000')  # Some remaining cash

        # Mock the initial_selection method to return a fixed list of instruments
        mock_instruments = [
            Instrument('MSFT', 'Microsoft Corporation'),
            Instrument('AMZN', 'Amazon.com, Inc.'),
            Instrument('TSLA', 'Tesla, Inc.'),
        ]
        mock_sample.return_value = [inst.symbol for inst in mock_instruments]

        # Update market prices for the new instruments
        market.prices.update({
            'MSFT': 300.0,
            'AMZN': 3300.0,
            'TSLA': 700.0,
        })

        trader = t.MonkeyTrader(market, portfolio)

        # Call rebalance
        trader.rebalance()

        # Assertions
        assert len(portfolio.positions) == 3  # New positions for MSFT, AMZN, TSLA
        assert all(pos.instrument in mock_instruments for pos in portfolio.positions)
        assert all(pos.instrument not in initial_positions for pos in portfolio.positions)
