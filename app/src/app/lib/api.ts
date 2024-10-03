const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function getPortfolios(): Promise<PortfolioData> {
    const res = await fetch(`${baseUrl}/api/portfolios`, {
        cache: 'no-store',
    });
    if (!res.ok) {
        throw new Error('Failed to fetch portfolios');
    }
    return res.json();
}

export async function getTrades() {
    const res = await fetch(`${baseUrl}/api/trades`, {
        cache: 'no-store',
    });
    if (!res.ok) {
        throw new Error('Failed to fetch trades');
    }
    return res.json();
}

export async function getValuations() {
    const res = await fetch(`${baseUrl}/api/valuations`, {
        cache: 'no-store',
    });
    if (!res.ok) {
        throw new Error('Failed to fetch valuations');
    }
    return res.json();
}