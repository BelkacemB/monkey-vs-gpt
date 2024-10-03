import pytest
from src.lib.fin import Instrument, Trade, Position, Portfolio, Market

@pytest.fixture
def instrument():
    return Instrument(symbol='AAPL', name='Apple Inc.')

@pytest.fixture
def trade(instrument):
    return Trade(instrument=instrument, quantity=10, price=150.0)

@pytest.fixture
def sell_trade(instrument):
    return Trade(instrument=instrument, quantity=-5, price=160.0)


@pytest.fixture
def portfolio():
    return Portfolio()

@pytest.fixture
def non_empty_portfolio(trade):
    portfolio = Portfolio(positions=[Position(instrument=trade.instrument, quantity=5, price=100.0)], balance=10000)
    return portfolio

def test_add_trade(portfolio, trade):
    initial_balance = portfolio.balance
    portfolio.add(trade)

    # Check if the trade was added
    assert len(portfolio.positions) == 1
    assert portfolio.positions[0].instrument == trade.instrument
    assert portfolio.positions[0].quantity == trade.quantity
    assert portfolio.positions[0].price == trade.price

    # Check if the balance was updated
    expected_balance = initial_balance - (trade.price * trade.quantity)
    assert portfolio.balance == expected_balance

def test_add_trade_existing_position(portfolio, trade):
    portfolio.add(trade)
    initial_balance = portfolio.balance
    
    # Add another trade for the same instrument
    new_trade = Trade(instrument=trade.instrument, quantity=5, price=160.0)
    portfolio.add(new_trade)
    
    # Check if the position was updated
    assert len(portfolio.positions) == 1
    assert portfolio.positions[0].instrument == trade.instrument
    assert portfolio.positions[0].quantity == trade.quantity + new_trade.quantity
    expected_price = (trade.price * trade.quantity + new_trade.price * new_trade.quantity) / (trade.quantity + new_trade.quantity)
    assert portfolio.positions[0].price == expected_price
    
    # Check if the balance was updated
    expected_balance = initial_balance - (new_trade.price * new_trade.quantity)
    assert portfolio.balance == expected_balance

def test_add_sell_trade(non_empty_portfolio, sell_trade):
    initial_balance = non_empty_portfolio.balance
    non_empty_portfolio.add(sell_trade)

    # Check that no position remains
    assert len(non_empty_portfolio.positions) == 0

    # Check if the balance was updated
    expected_balance = initial_balance + (sell_trade.price * abs(sell_trade.quantity))
    assert non_empty_portfolio.balance == expected_balance

def test_add_trade_insufficient_balance(portfolio, trade):
    # Create a trade that costs more than the available balance
    expensive_trade = Trade(instrument=trade.instrument, quantity=1000, price=150.0)
    
    with pytest.raises(ValueError, match="Insufficient cash for the trade"):
        portfolio.add(expensive_trade)

def test_portfolio_str(portfolio, trade):
    portfolio.add(trade)
    portfolio_str = str(portfolio)
    
    expected_str = f'{trade.instrument.symbol}: {trade.quantity} @ {trade.price:.2f}'
    assert portfolio_str == expected_str

def test_portfolio_repr(portfolio, trade):
    portfolio.add(trade)
    portfolio_repr = repr(portfolio)
    
    expected_repr = f'{trade.instrument.symbol}: {trade.quantity} @ {trade.price:.2f}'
    assert portfolio_repr == expected_repr