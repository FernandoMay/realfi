'use client'

import { useEffect } from 'react'
import { toast } from '@/hooks/use-toast'
import { Bell, CheckCircle, AlertCircle, Info, TrendingUp } from 'lucide-react'

interface NotificationData {
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  duration?: number
}

export function useNotifications() {
  const showNotification = (data: NotificationData) => {
    const { title, message, type, duration = 5000 } = data
    
    const icons = {
      success: <CheckCircle className="h-4 w-4 text-green-500" />,
      error: <AlertCircle className="h-4 w-4 text-red-500" />,
      warning: <AlertCircle className="h-4 w-4 text-yellow-500" />,
      info: <Info className="h-4 w-4 text-blue-500" />
    }

    toast({
      title: `${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'} ${title}`,
      description: message,
      variant: type === 'error' ? 'destructive' : type === 'success' ? 'success' : type === 'warning' ? 'warning' : 'info',
      duration
    })
  }

  const showSuccess = (title: string, message: string) => {
    showNotification({ type: 'success', title, message })
  }

  const showError = (title: string, message: string) => {
    showNotification({ type: 'error', title, message })
  }

  const showInfo = (title: string, message: string) => {
    showNotification({ type: 'info', title, message })
  }

  const showWarning = (title: string, message: string) => {
    showNotification({ type: 'warning', title, message })
  }

  return {
    showNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning
  }
}

export function NotificationProvider() {
  useEffect(() => {
    // Welcome notification
    setTimeout(() => {
      toast({
        title: "🔔 Welcome to RealFi Community Trust Hub!",
        description: "Your privacy-first financial ecosystem is ready. Start by verifying your identity.",
        duration: 8000
      })
    }, 1000)

    // Periodic notifications
    const interval = setInterval(() => {
      const notifications = [
        {
          title: "💰 UBI Available",
          message: "Your daily G$ 10 is ready to claim!",
          type: "info" as const
        },
        {
          title: "📈 Savings Growing",
          message: "Your savings are earning 5% APY. Keep it up!",
          type: "success" as const
        },
        {
          title: "🤖 AI Insight Ready",
          message: "New community insights are available for you to explore.",
          type: "info" as const
        },
        {
          title: "🏛️ Governance Update",
          message: "New community proposals need your vote!",
          type: "warning" as const
        }
      ]

      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)]
      
      toast({
        title: randomNotification.title,
        description: randomNotification.message,
        variant: randomNotification.type === 'success' ? 'success' : 
                 randomNotification.type === 'warning' ? 'warning' : 'info',
        duration: 6000
      })
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return null
}