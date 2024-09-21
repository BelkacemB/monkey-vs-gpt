import yfinance as yf
from fin import Market
import pandas as pd
from typing import List
import logging
import time
from datetime import datetime

def load_market_data() -> Market:
    start_time = time.time()
    tickers = get_index_constituents()

    # Load prices & news
    prices = load_latest_prices(tickers)
    news = load_latest_news(tickers)

    market = Market(prices=prices, news=news, date=datetime.now())
    logging.info(f"Market data loaded in {time.time() - start_time:.2f} seconds")
    return market


def load_latest_prices(tickers: List[str]) -> dict:
    data = yf.download(tickers, period='1d')
    prices = data['Adj Close']
    prices = prices.dropna(axis=1)
    prices = prices.iloc[-1].to_dict()
    return prices

def load_latest_news(tickers: List[str]) -> List[str]:
    index = yf.Ticker("^GSPC")
    return [article['title'] for article in index.news]


def get_index_constituents() -> List[str]:
    df = pd.read_csv('src/data/constituents.csv')
    return df['Symbol'].tolist()