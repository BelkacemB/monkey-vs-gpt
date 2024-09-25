import { getValuations } from '@/app/lib/valuations';
import { getTrades } from '@/app/lib/trades'
import PortfolioChart from '@/app/ui/portfolio-chart'
import TradeTimeline from '@/app/ui/timeline'
import PortfolioSummary from '@/app/ui/summary'

export default async function Home() {
  const [valuations, trades] = await Promise.all([
    getValuations(),
    getTrades(),
  ]);

  return (
    <div className="min-h-screen ">
      <main className="px-16 py-8">
        <h1 className="my-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0">
          Monkey vs GPT
        </h1>

        {valuations && (
        <div className="flex mb-12 justify-around items-center gap-8">
          <PortfolioSummary name="Monkey Portfolio" valuations={valuations} />
          <PortfolioSummary name="GPT Portfolio" valuations={valuations} />
          </div>
        )}

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Portfolio Valuations</h2>
          <PortfolioChart valuations={valuations} />
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Last Trades</h2>
          <TradeTimeline trades={trades} />
        </section>
      </main>
      <footer className="text-center p-4 ">
        <p>&copy; 2024 Monkey vs GPT</p>
      </footer>
    </div>
  );
}
