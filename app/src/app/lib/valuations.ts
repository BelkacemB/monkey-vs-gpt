export async function getValuations() {
    const res = await fetch('http://localhost:3000/api/valuations', {
        cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch valuations');
    }
    return res.json();
  }