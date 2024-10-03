import PortfolioChart from '@/app/ui/portfolio-chart'
import TradeTimeline from '@/app/ui/timeline'
import Portfolio from '@/app/ui/portfolio'
import { getPortfolios, getValuations, getTrades } from '@/app/lib/api'

export default async function Home() {
  const portfolios = await getPortfolios();
  const valuations = await getValuations();
  const trades = await getTrades();

  return (
    <>
      <h1 className="p-4 scroll-m-20 border-b pb-2 font-semibold tracking-tight transition-colors first:mt-0">
        Monkey vs GPT
      </h1>
          <main className="flex flex-col p-8 md:p-16 gap-8">
              {portfolios && valuations && (
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <Portfolio positions={portfolios.chatGptPortfolio.positions} cash={portfolios.chatGptPortfolio.balance} name="The Silicon Trader" type="bot" />
                  <Portfolio positions={portfolios.monkeyPortfolio.positions} cash={portfolios.monkeyPortfolio.balance} name="The Kong of Wall Street" type="random" />
                </div>
              )}

              <section className="flex flex-col justify-center">
                {valuations && <PortfolioChart valuations={valuations} />}
              </section>

              <section className="mb-12 flex flex-col justify-center">
                {trades && <TradeTimeline trades={trades} />}
              </section>
          </main>
          <footer className="text-center p-4">
            <p>&copy; 2024 Monkey vs GPT</p>
          </footer>
    </>
  );
}
