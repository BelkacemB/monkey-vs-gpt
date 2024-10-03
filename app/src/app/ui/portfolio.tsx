'use client'

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Wallet } from "lucide-react"

interface PortfolioProps {
  positions: Position[]
  cash: number,
  name: string
}

export default function Portfolio({ positions, cash, name }: PortfolioProps) {
  const [isOverflowing, setIsOverflowing] = useState(false)
  const tickerRef = useRef<HTMLDivElement>(null)
  const totalValue = positions.reduce((sum, stock) => sum + stock.quantity * stock.price, 0) + cash

  useEffect(() => {
    const ticker = tickerRef.current
    if (ticker) {
      setIsOverflowing(ticker.scrollWidth > ticker.clientWidth)
    }
  }, [positions])

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center">
          <DollarSign className="mr-2" />
          {name}
        </CardTitle>
        <CardDescription>Your current stock holdings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Total Value</h3>
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
            <p className="font-semibold">${cash?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}