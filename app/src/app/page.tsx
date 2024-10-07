import Image from 'next/image'
import PortfolioChart from '@/app/ui/portfolio-chart'
import TradeTimeline from '@/app/ui/timeline'
import Portfolio from '@/app/ui/portfolio'
import { getPortfolios, getValuations, getTrades } from '@/app/lib/api'
import { Separator } from '@/components/ui/separator'
import Header from './ui/header'

export const dynamic = 'force-dynamic';

export default async function Home() {
  const portfolios = await getPortfolios();
  const valuations = await getValuations();
  const trades = await getTrades();

  const latestMonkeyValuation = valuations.monkeyValuations[valuations.monkeyValuations.length - 1]
  const latestChatGptValuation = valuations.chatGptValuations[valuations.chatGptValuations.length - 1]

  return (
    <>
      <Header />
      <main className="flex flex-col m-8 md:m-16 gap-8 ">
        {portfolios && valuations && (
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center relative">
            <div className="md:transform md:-translate-y-4">
              <Portfolio
                positions={portfolios.chatGptPortfolio.positions}
                cash={portfolios.chatGptPortfolio.balance}
                name="Wall-E Street"
                type="bot"
                latestValuation={latestChatGptValuation}
              />
            </div>
            <div className="hidden md:block">
              <Image src="/thunder.png" alt="VS" width={60} height={100} />
            </div>
            <div className="md:transform md:translate-y-4">
              <Portfolio
                positions={portfolios.monkeyPortfolio.positions}
                cash={portfolios.monkeyPortfolio.balance}
                name="The Gorillionaire"
                latestValuation={latestMonkeyValuation}
                type="random"
              />
            </div>
          </div>
        )}
        <Separator className="my-4" />
        <section className="flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-4">Historical Performance</h2>
          {valuations && <PortfolioChart valuations={valuations} />}
        </section>
        <Separator />
        <section className="mb-12 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold mb-4">Recent Trades</h2>
          {trades && <TradeTimeline trades={trades} />}
        </section>
      </main>
    </>
  );
}
