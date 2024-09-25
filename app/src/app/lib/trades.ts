export async function getTrades() {
    const res = await fetch('http://localhost:3000/api/trades', {
        cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch trades');
    }
    return res.json();
  }