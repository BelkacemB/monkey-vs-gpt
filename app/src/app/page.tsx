'use client'

import { getValuations } from '@/app/lib/valuations';
import { getTrades } from '@/app/lib/trades'
import { getPortfolios } from '@/app/lib/portfolios'
import PortfolioChart from '@/app/ui/portfolio-chart'
import TradeTimeline from '@/app/ui/timeline'
import Portfolio from '@/app/ui/portfolio'
import { ParallaxProvider, Parallax } from 'react-scroll-parallax';
import { useEffect, useState } from 'react';

export default function Home() {
  const [portfolios, setPortfolios] = useState<PortfolioData | null>(null);
  const [valuations, setValuations] = useState<ValuationData | null>(null);
  const [trades, setTrades] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const [portfoliosData, valuationsData, tradesData] = await Promise.all([
        getPortfolios(),
        getValuations(),
        getTrades(),
      ]);
      setPortfolios(portfoliosData);
      setValuations(valuationsData);
      setTrades(tradesData);
    }
    fetchData();
  }, []);

  return (
    <>
      <h1 className="p-4 scroll-m-20 border-b pb-2 font-semibold tracking-tight transition-colors first:mt-0">
        Monkey vs GPT
      </h1>
      <ParallaxProvider>
        <div className="min-h-screen">
          <main className="px-16">


            <Parallax speed={-10}>
              {portfolios && valuations && (
                <div className="flex flex-col md:flex-row min-h-screen items-center">
                  <Portfolio positions={portfolios.chatGptPortfolio.positions} cash={portfolios.chatGptPortfolio.balance} name="ChatGPT" />
                  <Portfolio positions={portfolios.monkeyPortfolio.positions} cash={portfolios.monkeyPortfolio.balance} name="The Kong of Wall Street" />
                </div>
              )}
            </Parallax>

            <Parallax speed={-5}>
              <section className="min-h-screen flex flex-col justify-center">
                {valuations && <PortfolioChart valuations={valuations} />}
              </section>
            </Parallax>

            <Parallax speed={-2}>
              <section className="mb-12 min-h-screen flex flex-col justify-center">
                <h2 className="text-2xl font-semibold mb-4">Last Trades</h2>
                {trades && <TradeTimeline trades={trades} />}
              </section>
            </Parallax>
          </main>
          <footer className="text-center p-4">
            <p>&copy; 2024 Monkey vs GPT</p>
          </footer>
        </div>
      </ParallaxProvider>
    </>
  );
}
