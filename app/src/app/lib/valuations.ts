export async function getValuations() {
    const res = await fetch('http://localhost:3000/api/valuations');
    if (!res.ok) {
      throw new Error('Failed to fetch valuations');
    }
    return res.json();
  }