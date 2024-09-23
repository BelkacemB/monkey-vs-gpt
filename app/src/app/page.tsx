import { getPortfolios } from '@/app/lib/portfolios';
import { getValuations } from '@/app/lib/valuations';
import { getTrades } from '@/app/lib/trades'

export default async function Home() {
  const [portfolios, valuations, trades] = await Promise.all([
    getPortfolios(),
    getValuations(),
    getTrades(),
  ]);

  return (
    <div>
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-6">Trading Dashboard</h1>
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Portfolios</h2>
          <pre className="p-4 rounded-lg overflow-auto">
            {JSON.stringify(portfolios, null, 2)}
          </pre>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Valuations</h2>
          <pre className="p-4 rounded-lg overflow-auto">
            {JSON.stringify(valuations, null, 2)}
          </pre>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Trades</h2>
          <pre className="p-4 rounded-lg overflow-auto">
            {JSON.stringify(trades, null, 2)}
          </pre>
        </section>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center p-4">
        <p>&copy; 2024 Monkey vs GPT</p>
      </footer>
    </div>
  );
}
