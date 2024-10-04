'use client'

interface TradeTimelineProps {
  trades: Trades;
}

export default function TradeTimeline({ trades }: TradeTimelineProps) {
  const allTrades = [...trades.gptTrades, ...trades.monkeyTrades].sort((a, b) =>
    new Date(b.SK).getTime() - new Date(a.SK).getTime()
  );

  return (
    <div className="relative">
      <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-foreground to-accent"></div>
      {allTrades.slice(0, 5).map((trade, index) => {
        const isGPTTrade = trade.PK.includes('CHATGPT');
        return (
          <div key={index} className="mb-8 flex justify-center items-center w-full relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-background border-2 border-secondary-500"></div>
            {isGPTTrade ? (
              <>
                <div className="w-5/12 pr-8">
                  <div className="p-4 rounded-lg shadow-lg">
                    <TradeContent trade={trade} />
                  </div>
                </div>
                <div className="w-5/12"></div>
              </>
            ) : (
              <>
                <div className="w-5/12"></div>
                <div className="w-5/12 pl-8">
                  <div className="p-4 rounded-lg shadow-lg">
                    <TradeContent trade={trade} />
                  </div>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function TradeContent({ trade }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">{trade.symbol}</h3>
      <p className="text-sm">Quantity: {trade.quantity}</p>
      <p className="text-sm">Price: ${trade.price.toFixed(2)}</p>
      <p className="text-xs ">
        {new Date(trade.SK).toISOString().replace('T', ' ').slice(0, 10)}
      </p>
      {trade.explanation && (
        <p className="text-xs mt-2 text-muted-foreground italic">{trade.explanation}</p>
      )}
    </div>
  );
}