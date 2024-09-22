type Instrument = {
    symbol: string;
    name?: string | null;
};

type Trade = {
    instrument: Instrument;
    quantity: number;
    price: number;
    explanation?: string | null;
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
