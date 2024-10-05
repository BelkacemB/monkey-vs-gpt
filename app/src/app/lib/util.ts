import symbolToSecurity from './symbol_to_security.json';

export const getTimeAgo = (date: string) => {
    const now = new Date();
    const tradeDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - tradeDate.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };


export const getStockNameFromSymbol = (symbol: string) => {
    return symbolToSecurity[symbol] || symbol;
};

