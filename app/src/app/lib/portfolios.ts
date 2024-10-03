export async function getPortfolios(): Promise<PortfolioData> {
    const res = await fetch('http://localhost:3000/api/portfolios', {
        cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch portfolios');
    }
    return res.json();
  }