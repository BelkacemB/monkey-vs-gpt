'use client'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getStockNameFromSymbol, getTimeAgo } from "../lib/util";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface TradeTimelineProps {
  trades: Trades;
}

const randomMonkeyNoises = [
  '🙈',
  'Ooh ooh aah aah',
  '*Angry grunting noises*',
  'Eee eee eee!',
  '🐒',
  '*Chest beating sounds*',
  'Hoo hoo hoo!',
  '*Excited screeching*',
  '🙊',
  '*Curious chittering*',
  'Uki uki uki!',
  '*Playful hooting*',
  '🙉',
  '*Banana munching sounds*',
  'Whoop whoop!',
  '*Tree shaking noises*',
  'Ook ook!',
  '*Warning call*',
  'Eeek eeek!',
  '*Grooming clicks*'
];

export default function TradeTimeline({ trades }: TradeTimelineProps) {
  const allTrades = [...trades.gptTrades, ...trades.monkeyTrades].sort((a, b) =>
    new Date(b.SK).getTime() - new Date(a.SK).getTime()
  );

  return (
    <div className="relative">
      <div className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 h-full w-1 bg-gradient-to-b from-foreground to-accent"></div>
      {allTrades.slice(0, 5).map((trade, index) => {
        const isGPTTrade = trade.PK.includes('CHATGPT');
        return (
          <div key={index} className="mb-8 flex w-full relative">
            <div className="absolute left-4 sm:left-1/2 sm:-translate-x-1/2 w-4 h-4 rounded-full bg-background border-2 border-secondary-500"></div>
            
            {/* Mobile: Single column layout */}
            <div className="sm:hidden w-full pl-12">
              <div className="p-4 rounded-lg shadow-lg">
                <TradeContent trade={trade} type={isGPTTrade ? "bot" : "monkey"} />
              </div>
            </div>
            
            {/* Desktop: Two column layout */}
            <div className="hidden sm:flex w-full justify-center items-center">
              {isGPTTrade ? (
                <>
                  <div className="w-5/12 pr-8">
                    <div className="p-4 rounded-lg shadow-lg">
                      <TradeContent trade={trade} type="bot" />
                    </div>
                  </div>
                  <div className="w-5/12"></div>
                </>
              ) : (
                <>
                  <div className="w-5/12"></div>
                  <div className="w-5/12 pl-8">
                    <div className="p-4 rounded-lg shadow-lg">
                      <TradeContent trade={trade} type="monkey" />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface TradeContentProps {
  trade: Trade;
  type: 'bot' | 'monkey';
}

function TradeContent({ trade, type }: TradeContentProps) {
  const maxExplanationLength = 100;

  return (
    <TooltipProvider>
      <div className="relative pt-10 sm:pt-0">
        <div className="absolute top-0 right-0 flex items-center">
          <p className="text-xs text-muted-foreground mr-2 hidden sm:inline">
            {getTimeAgo(trade.SK)}
          </p>
          <Avatar className="h-8 w-8">
            <AvatarImage src={type === 'bot' ? '/robot.png' : '/monkey.png'} />
            <AvatarFallback>
              {type === 'bot' ? 'B' : 'R'}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
          <h3 className="text-lg font-semibold">
            {getStockNameFromSymbol(trade.symbol)} <span className="text-muted-foreground">({trade.symbol})</span>
          </h3>
          <p className="text-xs text-muted-foreground sm:hidden">
            {getTimeAgo(trade.SK)}
          </p>
        </div>
        <p className="text-sm">Action: <strong>{trade.quantity > 0 ? 'Buy' : 'Sell'}</strong></p>
        <p className="text-sm">Price: ${trade.price.toFixed(2)}</p>

        {type === 'bot' && trade.explanation && (
          <Tooltip>
            <TooltipTrigger asChild>
              <p className="text-xs mt-2 text-muted-foreground italic">
                <span className="text-3xl italic mr-2">&quot;</span>
                {trade.explanation.length > maxExplanationLength
                  ? `${trade.explanation.slice(0, maxExplanationLength)}...`
                  : trade.explanation}
              </p>
            </TooltipTrigger>
            {trade.explanation.length > maxExplanationLength && (
              <TooltipContent side="bottom" className="max-w-md">
                <p className="text-xs whitespace-pre-wrap">{trade.explanation}</p>
              </TooltipContent>
            )}
          </Tooltip>
        )}
        {type === 'monkey' && (
          <p className="mt-2 text-muted-foreground italic">
            <span className="text-3xl italic mr-2">&quot;</span>
            {randomMonkeyNoises[Math.floor(Math.random() * randomMonkeyNoises.length)]}
          </p>
        )}
      </div>
    </TooltipProvider>
  );
}