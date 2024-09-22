import json
import pytest
from unittest.mock import patch, MagicMock
from src import app
from src.lib.fin import Portfolio, Market, Trade, Instrument
from datetime import datetime

@pytest.fixture
def mock_market():
    return Market(
        date=datetime(2023, 4, 1),
        prices={'AAPL': 150.0, 'GOOGL': 2000.0}
    )

@pytest.fixture
def mock_portfolio():
    return Portfolio(
        positions=[],
        balance=10000.0
    )

@pytest.fixture
def mock_trade():
    return Trade(
        instrument=Instrument('AAPL', 'Apple Inc.'),
        quantity=10,
        price=150.0,
        explanation="Test trade"
    )

@patch('src.app.load_market_data')
@patch('src.app.load_portfolio')
@patch('src.app.ChatGPTTrader')
@patch('src.app.MonkeyTrader')
@patch('src.app.save_trade')
@patch('src.app.save_portfolio_valuation')
@patch('src.app.save_portfolio')
def test_lambda_handler(mock_save_portfolio, mock_save_portfolio_valuation, 
                        mock_save_trade, MockMonkeyTrader, MockChatGPTTrader, 
                        mock_load_portfolio, mock_load_market_data, 
                        mock_market, mock_portfolio, mock_trade):
    
    # Set up mocks
    mock_load_market_data.return_value = mock_market
    mock_load_portfolio.return_value = mock_portfolio
    
    mock_chatgpt_trader = MockChatGPTTrader.return_value
    mock_chatgpt_trader.generate_trade.return_value = mock_trade
    
    mock_monkey_trader = MockMonkeyTrader.return_value
    mock_monkey_trader.generate_trade.return_value = None  # No trade for monkey

    # Call the lambda handler
    result = app.lambda_handler({}, {})

    # Assert the result
    assert result['statusCode'] == 200
    body = json.loads(result['body'])
    assert 'date' in body
    assert 'chatgpt_portfolio' in body
    assert 'monkey_portfolio' in body

    # Check ChatGPT portfolio
    assert body['chatgpt_portfolio']['value'] == 11500.0  # 10000 + (10 * 150)
    assert body['chatgpt_portfolio']['trade'] == str(mock_trade)

    # Check Monkey portfolio
    assert body['monkey_portfolio']['value'] == 10000.0
    assert body['monkey_portfolio']['trade'] == "No trade"

    # Verify function calls
    mock_load_market_data.assert_called_once()
    mock_load_portfolio.assert_called_with('chatgpt')
    mock_load_portfolio.assert_called_with('monkey')
    mock_save_trade.assert_called_once_with('chatgpt', mock_trade, mock_market.date)
    mock_save_portfolio_valuation.assert_called_with('chatgpt', 11500.0, mock_market.date)
    mock_save_portfolio_valuation.assert_called_with('monkey', 10000.0, mock_market.date)
    mock_save_portfolio.assert_called_with('chatgpt', mock_portfolio)
    mock_save_portfolio.assert_called_with('monkey', mock_portfolio)
