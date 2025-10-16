import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// Mock user balances and transactions
const userBalances = new Map<string, any>()
const transactions = new Map<string, any[]>()

export async function POST(request: NextRequest) {
  try {
    const { action, data, userId } = await request.json()

    switch (action) {
      case 'connect-human-wallet':
        // Simulate Human Wallet connection
        const walletAddress = `0x${Math.random().toString(16).substr(2, 40)}`
        const walletData = {
          walletAddress,
          network: 'Celo',
          connectedAt: new Date().toISOString(),
          features: ['stablecoin_payments', 'peanut_links', 'accessible_recovery']
        }

        // Initialize user balance if not exists
        if (!userBalances.has(userId)) {
          userBalances.set(userId, {
            gBalance: 0,
            usdBalance: 0,
            savings: 0,
            walletAddress
          })
        }

        return NextResponse.json({
          success: true,
          data: walletData
        })

      case 'claim-ubi':
        // Simulate GoodDollar UBI claim
        const userBalance = userBalances.get(userId) || { gBalance: 0, usdBalance: 0, savings: 0 }
        const ubiAmount = 10 // G$ 10 daily UBI
        const newBalance = userBalance.gBalance + ubiAmount
        
        userBalances.set(userId, {
          ...userBalance,
          gBalance: newBalance,
          lastClaim: new Date().toISOString()
        })

        // Record transaction
        const txId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const transaction = {
          id: txId,
          type: 'ubi_claim',
          amount: ubiAmount,
          currency: 'G$',
          timestamp: new Date().toISOString(),
          status: 'completed'
        }

        if (!transactions.has(userId)) {
          transactions.set(userId, [])
        }
        transactions.get(userId).push(transaction)

        return NextResponse.json({
          success: true,
          data: {
            transaction,
            newBalance,
            message: `Successfully claimed G$ ${ubiAmount} UBI`
          }
        })

      case 'send-payment':
        // Simulate payment with Peanut Protocol
        const { recipient, amount, currency } = data
        const senderBalance = userBalances.get(userId)
        
        if (!senderBalance || senderBalance.gBalance < amount) {
          return NextResponse.json({
            success: false,
            error: 'Insufficient balance'
          }, { status: 400 })
        }

        // Calculate fee (0.5%)
        const fee = amount * 0.005
        const totalDeduction = amount + fee
        
        // Update sender balance
        userBalances.set(userId, {
          ...senderBalance,
          gBalance: senderBalance.gBalance - totalDeduction
        })

        // Create payment link (Peanut Protocol simulation)
        const paymentLink = `https://peanut.to/claim/${Math.random().toString(36).substr(2, 16)}`
        
        const paymentTx = {
          id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'payment',
          recipient,
          amount,
          currency,
          fee,
          paymentLink,
          timestamp: new Date().toISOString(),
          status: 'completed'
        }

        if (!transactions.has(userId)) {
          transactions.set(userId, [])
        }
        transactions.get(userId).push(paymentTx)

        return NextResponse.json({
          success: true,
          data: {
            transaction: paymentTx,
            remainingBalance: userBalances.get(userId).gBalance,
            message: `Payment sent successfully. Fee: G$ ${fee.toFixed(2)}`
          }
        })

      case 'deposit-savings':
        // Simulate savings deposit with 5% interest
        const { depositAmount } = data
        const currentBalance = userBalances.get(userId)
        
        if (!currentBalance || currentBalance.gBalance < depositAmount) {
          return NextResponse.json({
            success: false,
            error: 'Insufficient balance for deposit'
          }, { status: 400 })
        }

        userBalances.set(userId, {
          ...currentBalance,
          gBalance: currentBalance.gBalance - depositAmount,
          savings: currentBalance.savings + depositAmount
        })

        const savingsTx = {
          id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'savings_deposit',
          amount: depositAmount,
          currency: 'G$',
          interestRate: 5,
          timestamp: new Date().toISOString(),
          status: 'completed'
        }

        if (!transactions.has(userId)) {
          transactions.set(userId, [])
        }
        transactions.get(userId).push(savingsTx)

        return NextResponse.json({
          success: true,
          data: {
            transaction: savingsTx,
            totalSavings: userBalances.get(userId).savings,
            message: `Deposited G$ ${depositAmount} to savings (5% APY)`
          }
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Finance API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const userId = searchParams.get('userId')

  try {
    switch (action) {
      case 'get-balance':
        if (!userId) {
          return NextResponse.json({
            success: false,
            error: 'User ID required'
          }, { status: 400 })
        }

        const balance = userBalances.get(userId) || {
          gBalance: 0,
          usdBalance: 0,
          savings: 0
        }

        return NextResponse.json({
          success: true,
          data: {
            ...balance,
            gUSDValue: balance.gBalance * 0.01, // G$ to USD conversion
            savingsUSDValue: balance.savings * 0.01,
            projectedAnnualReturn: balance.savings * 0.05 // 5% APY
          }
        })

      case 'get-transactions':
        if (!userId) {
          return NextResponse.json({
            success: false,
            error: 'User ID required'
          }, { status: 400 })
        }

        const userTransactions = transactions.get(userId) || []
        
        return NextResponse.json({
          success: true,
          data: {
            transactions: userTransactions.sort((a, b) => 
              new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
            ),
            totalCount: userTransactions.length
          }
        })

      case 'get-market-rates':
        // Simulate market rates
        return NextResponse.json({
          success: true,
          data: {
            'G$': {
              price: 0.01, // 1 G$ = $0.01 USD
              change24h: 0.5,
              volume24h: 1500000
            },
            'CELO': {
              price: 0.85,
              change24h: -2.3,
              volume24h: 25000000
            },
            'USDC': {
              price: 1.00,
              change24h: 0.1,
              volume24h: 50000000
            }
          }
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Finance GET API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}