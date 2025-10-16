'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Wallet, TrendingUp, PiggyBank, Send, DollarSign, Activity } from 'lucide-react'

interface Balance {
  gBalance: number
  usdBalance: number
  savings: number
  gUSDValue: number
  savingsUSDValue: number
  projectedAnnualReturn: number
}

interface Transaction {
  id: string
  type: string
  amount: number
  currency: string
  timestamp: string
  status: string
  recipient?: string
  fee?: number
  paymentLink?: string
}

export default function FinanceDashboard() {
  const [userId] = useState(`user_${Date.now()}`)
  const [balance, setBalance] = useState<Balance>({
    gBalance: 0,
    usdBalance: 0,
    savings: 0,
    gUSDValue: 0,
    savingsUSDValue: 0,
    projectedAnnualReturn: 0
  })
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)

  useEffect(() => {
    fetchBalance()
    fetchTransactions()
  }, [])

  const fetchBalance = async () => {
    try {
      const response = await fetch(`/api/finance?action=get-balance&userId=${userId}`)
      const result = await response.json()
      
      if (result.success) {
        setBalance(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error)
    }
  }

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`/api/finance?action=get-transactions&userId=${userId}`)
      const result = await response.json()
      
      if (result.success) {
        setTransactions(result.data.transactions)
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    }
  }

  const handleConnectWallet = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'connect-human-wallet',
          userId
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setWalletConnected(true)
        // Initialize with some balance for demo
        setBalance(prev => ({
          ...prev,
          gBalance: 50,
          gUSDValue: 0.50
        }))
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaimUBI = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'claim-ubi',
          userId
        })
      })

      const result = await response.json()
      
      if (result.success) {
        await fetchBalance()
        await fetchTransactions()
      }
    } catch (error) {
      console.error('Failed to claim UBI:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendPayment = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send-payment',
          userId,
          data: {
            recipient: `0x${Math.random().toString(16).substr(2, 40)}`,
            amount: 5,
            currency: 'G$'
          }
        })
      })

      const result = await response.json()
      
      if (result.success) {
        await fetchBalance()
        await fetchTransactions()
      }
    } catch (error) {
      console.error('Failed to send payment:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDepositSavings = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'deposit-savings',
          userId,
          data: {
            depositAmount: 10
          }
        })
      })

      const result = await response.json()
      
      if (result.success) {
        await fetchBalance()
        await fetchTransactions()
      }
    } catch (error) {
      console.error('Failed to deposit to savings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!walletConnected) {
    return (
      <Card>
        <CardHeader className="text-center">
          <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <CardTitle>Connect Your Human Wallet</CardTitle>
          <CardDescription>
            Access RealFi financial services with secure, easy onboarding
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={handleConnectWallet} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? 'Connecting...' : 'Connect Human Wallet'}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Balance Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">G$ Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{balance.gBalance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              ≈ ${balance.gUSDValue.toFixed(2)} USD
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{balance.savings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              5% APY → ${balance.projectedAnnualReturn.toFixed(2)}/year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(balance.gUSDValue + balance.savingsUSDValue).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Combined portfolio value
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Manage your RealFi finances with these tools
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Button 
              onClick={handleClaimUBI} 
              disabled={isLoading}
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <DollarSign className="h-6 w-6" />
              <span>Claim Daily UBI</span>
              <span className="text-xs opacity-75">Get G$ 10</span>
            </Button>
            
            <Button 
              onClick={handleSendPayment} 
              disabled={isLoading || balance.gBalance < 5}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <Send className="h-6 w-6" />
              <span>Send Payment</span>
              <span className="text-xs opacity-75">0.5% fee</span>
            </Button>
            
            <Button 
              onClick={handleDepositSavings} 
              disabled={isLoading || balance.gBalance < 10}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center gap-2"
            >
              <PiggyBank className="h-6 w-6" />
              <span>Deposit Savings</span>
              <span className="text-xs opacity-75">5% APY</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No transactions yet. Start by claiming your daily UBI!
            </p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      tx.type === 'ubi_claim' ? 'bg-green-100' :
                      tx.type === 'payment' ? 'bg-blue-100' :
                      tx.type === 'savings_deposit' ? 'bg-purple-100' : 'bg-gray-100'
                    }`}>
                      {tx.type === 'ubi_claim' && <DollarSign className="h-4 w-4 text-green-600" />}
                      {tx.type === 'payment' && <Send className="h-4 w-4 text-blue-600" />}
                      {tx.type === 'savings_deposit' && <PiggyBank className="h-4 w-4 text-purple-600" />}
                    </div>
                    <div>
                      <p className="font-medium capitalize">
                        {tx.type.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${
                      tx.type === 'ubi_claim' ? 'text-green-600' :
                      tx.type === 'payment' ? 'text-red-600' :
                      'text-purple-600'
                    }`}>
                      {tx.type === 'ubi_claim' ? '+' : tx.type === 'payment' ? '-' : '+'}
                      G$ {tx.amount.toFixed(2)}
                    </p>
                    {tx.fee && (
                      <p className="text-xs text-muted-foreground">
                        Fee: G$ {tx.fee.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}