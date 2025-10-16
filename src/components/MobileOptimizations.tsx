'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, X, Home, Shield, Wallet, Brain, User, Settings } from 'lucide-react'

interface MobileNavProps {
  children: React.ReactNode
}

export function MobileNav({ children }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { icon: Home, label: 'Overview', value: 'overview' },
    { icon: Shield, label: 'Identity', value: 'identity' },
    { icon: Wallet, label: 'Finance', value: 'finance' },
    { icon: Brain, label: 'Coordination', value: 'coordination' },
    { icon: User, label: 'Profile', value: 'profile' },
    { icon: Settings, label: 'Settings', value: 'settings' }
  ]

  return (
    <div className="lg:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">RealFi Hub</h2>
            </div>
            <nav className="flex-1 p-4">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Button
                    key={item.value}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      // Handle navigation
                      setIsOpen(false)
                    }}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.label}
                  </Button>
                ))}
              </div>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
      {children}
    </div>
  )
}

export function MobileBottomNav() {
  const [activeTab, setActiveTab] = useState('overview')

  const navItems = [
    { icon: Home, label: 'Home', value: 'overview' },
    { icon: Shield, label: 'Identity', value: 'identity' },
    { icon: Wallet, label: 'Finance', value: 'finance' },
    { icon: Brain, label: 'AI', value: 'coordination' },
    { icon: User, label: 'Profile', value: 'profile' }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t md:hidden z-50">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => (
          <Button
            key={item.value}
            variant="ghost"
            size="sm"
            className={`flex flex-col items-center gap-1 h-auto py-2 px-3 ${
              activeTab === item.value ? 'text-primary' : 'text-muted-foreground'
            }`}
            onClick={() => setActiveTab(item.value)}
          >
            <item.icon className="h-4 w-4" />
            <span className="text-xs">{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

export function PullToRefresh({ onRefresh }: { onRefresh: () => void }) {
  const [isPulling, setIsPulling] = useState(false)
  const [startY, setStartY] = useState(0)

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      setStartY(e.touches[0].clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      const currentY = e.touches[0].clientY
      const diff = currentY - startY
      
      if (diff > 100 && window.scrollY === 0) {
        setIsPulling(true)
      }
    }

    const handleTouchEnd = () => {
      if (isPulling) {
        onRefresh()
        setIsPulling(false)
      }
      setStartY(0)
    }

    document.addEventListener('touchstart', handleTouchStart)
    document.addEventListener('touchmove', handleTouchMove)
    document.addEventListener('touchend', handleTouchEnd)

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isPulling, startY, onRefresh])

  if (!isPulling) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="animate-spin">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
        <span className="text-sm">Refreshing...</span>
      </div>
    </div>
  )
}

export function SwipeableCard({ children, onSwipeLeft, onSwipeRight }: {
  children: React.ReactNode
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}) {
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    setCurrentX(e.touches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    
    const diff = currentX - startX
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && onSwipeRight) {
        onSwipeRight()
      } else if (diff < 0 && onSwipeLeft) {
        onSwipeLeft()
      }
    }

    setIsDragging(false)
    setCurrentX(0)
  }

  return (
    <div
      className="touch-pan-y"
      style={{
        transform: isDragging ? `translateX(${currentX - startX}px)` : 'none',
        transition: isDragging ? 'none' : 'transform 0.3s ease'
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  )
}

export function MobileOptimizedCard({ children, className }: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  )
}

export function ResponsiveGrid({ children, cols = 1 }: {
  children: React.ReactNode
  cols?: number
}) {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={`grid ${gridClasses[cols as keyof typeof gridClasses]} gap-4`}>
      {children}
    </div>
  )
}