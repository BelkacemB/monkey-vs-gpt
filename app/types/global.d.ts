type Instrument = {
    symbol: string;
    name?: string | null;
};

type Position = {
    instrument: Instrument;
    quantity: number;
    price: number;
};

type Portfolio = {
    positions: Position[];
    balance: number;
    add(trade: Trade): void;
};

type Market = {
    prices: Record<string, number>;
    news: string[];
    date: Date;
};

type Valuation = {
    SK: string;
    value: number;
};

type Valuations = {
    monkeyValuations: Valuation[];
    chatGptValuations: Valuation[];
};

type Trade = {
    PK: string;
    SK: string;
    date: Date;
    price: number;
    quantity: number;
    symbol: Instrument;
    explanation?: string | null;
};

type Trades = {
    gptTrades: Trade[];
    monkeyTrades: Trade[];
};

