# This is an interface for what a trader should look like

from abc import ABC, abstractmethod
from fin import Trade

class Trader(ABC):
    @abstractmethod
    def generate_trade(self) -> Trade:
        pass