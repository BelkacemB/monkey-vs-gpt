const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const getPortfolios = async (): Promise<PortfolioData> => {
    const res = await fetch(`${baseUrl}/api/portfolios`, {
        cache: 'no-store',
        next: { revalidate: 0 }
    });
    if (!res.ok) {
        throw new Error('Failed to fetch portfolios');
    }
    return res.json();
};

export const getTrades = async () => {
    const res = await fetch(`${baseUrl}/api/trades`, {
       cache: 'no-store',
       next: { revalidate: 0 }
    });
    if (!res.ok) {
        throw new Error('Failed to fetch trades');
    }
    return res.json();
};

export const getValuations = async (): Promise<ValuationData> => {
    const res = await fetch(`${baseUrl}/api/valuations`, {
        cache: 'no-store',
        next: { revalidate: 0 }
    });
    if (!res.ok) {
        throw new Error('Failed to fetch valuations');
    }
    return res.json();
};