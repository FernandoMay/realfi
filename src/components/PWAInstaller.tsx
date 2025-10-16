'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, X, Smartphone, Rocket } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
      
      toast({
        title: "🎉 App Installed Successfully!",
        description: "RealFi Community Trust Hub is now available on your device.",
        duration: 5000
      })
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    try {
      await deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        toast({
          title: "📱 Installing App...",
          description: "RealFi Hub is being installed on your device.",
          duration: 3000
        })
      }
      
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    } catch (error) {
      console.error('Error during installation:', error)
      toast({
        title: "Installation Failed",
        description: "Please try again or contact support.",
        variant: "destructive",
        duration: 5000
      })
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  // Check if user has dismissed the prompt recently
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      const timeDiff = Date.now() - parseInt(dismissed)
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24)
      
      if (daysDiff < 7) { // Don't show for 7 days after dismissal
        setShowInstallPrompt(false)
      }
    }
  }, [])

  if (isInstalled || !showInstallPrompt || !deferredPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
      <Card className="border-blue-200 bg-blue-50 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Smartphone className="h-5 w-5" />
              Install RealFi Hub
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-6 w-6 text-blue-600 hover:text-blue-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription className="text-blue-600">
            Get the full app experience with offline access and push notifications
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Rocket className="h-4 w-4 text-blue-600" />
              <span>Offline Access</span>
            </div>
            <div className="flex items-center gap-2">
              <Download className="h-4 w-4 text-blue-600" />
              <span>Quick Launch</span>
            </div>
            <div className="flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-blue-600" />
              <span>Native Feel</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">Free</Badge>
              <span>No Ads</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={handleInstallClick}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Install App
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDismiss}
              className="text-blue-600 border-blue-200 hover:bg-blue-100"
            >
              Maybe Later
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export function PWABadge() {
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }
  }, [])

  if (!isInstalled) return null

  return (
    <Badge variant="secondary" className="ml-2">
      <Smartphone className="h-3 w-3 mr-1" />
      Installed
    </Badge>
  )
}