'use client'

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from "lucide-react"
import Image from "next/image"
interface PortfolioProps {
  positions: Position[]
  cash: number,
  name: string,
  type: 'bot' | 'random'
}

export default function Portfolio({ positions, cash, name, type }: PortfolioProps) {
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

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          {type === 'bot' ? (
            <Image src={`/robot.svg`} alt={name} width={32} height={32} className="mr-2" />
          ) : (
            <Image src={`/monkey.svg`} alt={name} width={32} height={32} className="mr-2" />
          )}
          {name}
        </CardTitle>
        <CardDescription>
          {type === 'bot' ? 'ChatGPT-powered trader that reads financial news and makes trades based on the news' : 'Random trader that makes trades based on a random strategy'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Market value</h3>
          <p className="text-3xl font-bold">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
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