export async function getPortfolios() {
    const res = await fetch('http://localhost:3000/api/portfolios');
    if (!res.ok) {
      throw new Error('Failed to fetch portfolios');
    }
    return res.json();
  }