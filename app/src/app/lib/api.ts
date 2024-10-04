import { cache } from 'react';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const getPortfolios = cache(async (): Promise<PortfolioData> => {
    const res = await fetch(`${baseUrl}/api/portfolios`, {
        cache: 'no-store' // Cache for 2 hours (7200 seconds)
    });
    if (!res.ok) {
        throw new Error('Failed to fetch portfolios');
    }
    return res.json();
});

export const getTrades = cache(async () => {
    const res = await fetch(`${baseUrl}/api/trades`, {
       cache: 'no-store'
    });
    if (!res.ok) {
        throw new Error('Failed to fetch trades');
    }
    return res.json();
});

export const getValuations = cache(async (): Promise<ValuationData> => {
    const res = await fetch(`${baseUrl}/api/valuations`, {
        cache: 'no-store'
    });
    if (!res.ok) {
        throw new Error('Failed to fetch valuations');
    }
    return res.json();
});