'use client'

import { useEffect, useState } from 'react'
import { toast } from '@/hooks/use-toast'
import { useNotifications } from '@/components/NotificationSystem'
import { cache } from '@/lib/storage'

interface RealTimeEvent {
  id: string
  type: 'transaction' | 'governance' | 'ai' | 'ubi' | 'price'
  data: any
  timestamp: number
}

export function useRealTimeUpdates() {
  const [isConnected, setIsConnected] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now())
  const { showInfo, showSuccess } = useNotifications()

  useEffect(() => {
    // Simulate WebSocket connection
    const connectWebSocket = () => {
      setIsConnected(true)
      
      // Simulate receiving real-time updates
      const interval = setInterval(() => {
        const events: RealTimeEvent[] = [
          {
            id: `tx_${Date.now()}`,
            type: 'transaction',
            data: {
              hash: `0x${Math.random().toString(16).substr(2, 64)}`,
              status: 'completed',
              amount: Math.random() * 100
            },
            timestamp: Date.now()
          },
          {
            id: `gov_${Date.now()}`,
            type: 'governance',
            data: {
              proposalId: `prop_${Math.random().toString(16).substr(2, 16)}`,
              votes: Math.floor(Math.random() * 50) + 10
            },
            timestamp: Date.now()
          },
          {
            id: `price_${Date.now()}`,
            type: 'price',
            data: {
              symbol: 'G$',
              price: 0.01 + (Math.random() - 0.5) * 0.002,
              change: (Math.random() - 0.5) * 5
            },
            timestamp: Date.now()
          }
        ]

        const randomEvent = events[Math.floor(Math.random() * events.length)]
        handleRealTimeEvent(randomEvent)
      }, 15000) // Every 15 seconds

      return () => clearInterval(interval)
    }

    const cleanup = connectWebSocket()
    return cleanup
  }, [])

  const handleRealTimeEvent = (event: RealTimeEvent) => {
    setLastUpdate(event.timestamp)
    
    switch (event.type) {
      case 'transaction':
        if (event.data.status === 'completed') {
          toast({
            title: "✅ Transaction Completed",
            description: `Your transaction of G$ ${event.data.amount.toFixed(2)} was successful.`,
            duration: 5000
          })
        }
        break
        
      case 'governance':
        toast({
          title: "🏛️ Governance Update",
          description: `New votes received for proposal ${event.data.proposalId}. Total: ${event.data.votes}`,
          duration: 5000
        })
        break
        
      case 'price':
        const changeEmoji = event.data.change > 0 ? '📈' : '📉'
        toast({
          title: `${changeEmoji} Price Update`,
          description: `${event.data.symbol} is now $${event.data.price.toFixed(4)} (${event.data.change > 0 ? '+' : ''}${event.data.change.toFixed(2)}%)`,
          duration: 4000
        })
        break
        
      case 'ubi':
        showSuccess('UBI Available!', 'Your daily G$ 10 is ready to claim.')
        break
        
      case 'ai':
        showInfo('AI Insight Ready', 'New community insights are available.')
        break
    }
  }

  const simulateEvent = (type: RealTimeEvent['type']) => {
    const event: RealTimeEvent = {
      id: `manual_${Date.now()}`,
      type,
      data: { source: 'manual' },
      timestamp: Date.now()
    }
    handleRealTimeEvent(event)
  }

  return {
    isConnected,
    lastUpdate,
    simulateEvent
  }
}

export function ConnectionStatus() {
  const { isConnected, lastUpdate } = useRealTimeUpdates()

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span className="text-muted-foreground">
        {isConnected ? 'Connected' : 'Disconnected'}
      </span>
      <span className="text-xs text-muted-foreground">
        Last update: {new Date(lastUpdate).toLocaleTimeString()}
      </span>
    </div>
  )
}

export function LivePriceTicker() {
  const [prices, setPrices] = useState({
    'G$': 0.01,
    'CELO': 0.85,
    'USDC': 1.00
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => ({
        'G$': prev['G$'] + (Math.random() - 0.5) * 0.0001,
        'CELO': prev['CELO'] + (Math.random() - 0.5) * 0.01,
        'USDC': 1.00 + (Math.random() - 0.5) * 0.001
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-4 text-sm">
      {Object.entries(prices).map(([symbol, price]) => (
        <div key={symbol} className="flex items-center gap-1">
          <span className="font-medium">{symbol}:</span>
          <span>${price.toFixed(4)}</span>
        </div>
      ))}
    </div>
  )
}