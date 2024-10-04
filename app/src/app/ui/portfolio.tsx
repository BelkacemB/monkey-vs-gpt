'use client'

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, TrendingUp, TrendingDown } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface PortfolioProps {
  positions: Position[]
  cash: number,
  name: string,
  type: 'bot' | 'random',
  latestValuation: Valuation
}

export default function Portfolio({ positions, cash, name, type, latestValuation }: PortfolioProps) {
  const [isOverflowing, setIsOverflowing] = useState(false)
  const tickerRef = useRef<HTMLDivElement>(null)
  const totalValue = positions.reduce((sum, stock) => sum + stock.quantity * stock.price, 0) + cash

  useEffect(() => {
    const ticker = tickerRef.current
    if (ticker) {
      setIsOverflowing(ticker.scrollWidth > ticker.clientWidth)
    }
  }, [positions])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const performance = ((latestValuation.value - 10000) / 10000) * 100

  const getNameGradient = (type: 'bot' | 'random') => {
    return type === 'bot'
      ? 'bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500'
      : 'bg-gradient-to-r from-amber-700 via-yellow-900 to-orange-800';
  };

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <Avatar className="h-16 w-16 mr-4">
            <AvatarImage src={type === 'bot' ? '/robot.png' : '/monkey.png'} alt={name} />
            <AvatarFallback>
              {type === 'bot' ? 'B' : 'R'}
            </AvatarFallback>
          </Avatar>
          <span className={`text-2xl font-bold ${getNameGradient(type)} text-transparent bg-clip-text`}>
            {name}
          </span>
        </CardTitle>
        <CardDescription>
          {type === 'bot' ? 'ChatGPT-powered trader that reads financial news and makes trades based on the news' : 'Random trader that makes trades based on a random strategy'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
          <p className="text-sm text-muted-foreground">Total Value</p>
          <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
          </div>
          <Performance performance={performance} />
          </div>
        </div>
        <div className="overflow-hidden" style={{ height: '60px' }}>
          <div
            ref={tickerRef}
            className={`flex space-x-4 ${isOverflowing ? 'animate-ticker' : ''}`}
            style={{ animationDuration: `${positions.length * 1}s` }}
          >
            {positions.map((stock) => (
              <div key={stock.symbol} className="flex-shrink-0 bg-muted rounded-lg p-2 flex items-center space-x-2">
                <div>
                  <h4 className="font-semibold">{stock.name}</h4>
                  <p className="text-xs text-muted-foreground">{stock.symbol}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${(stock.quantity * stock.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="text-xs">{stock.quantity} @ ${stock.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center">
            <Wallet className="w-6 h-6 mr-2" />
            <h4 className="font-semibold">Cash</h4>
          </div>
          <div className="text-right">
            <p className="font-semibold">{formatCurrency(cash || 0)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// A react component that takes in a performance number and returns a the number with a up or down arrow, green or red
const Performance = ({ performance }: { performance: number }) => {
  return (
    <p className={`flex text-xl font-semibold items-center justify-end ${performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
      {performance >= 0 ? <TrendingUp className="w-8 h-8 mr-2" /> : <TrendingDown className="w-8 h-8 mr-1" />}
      {performance.toFixed(2)}%
    </p>
  )
}
