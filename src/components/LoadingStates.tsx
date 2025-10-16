'use client'

import { Loader2, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <Loader2 className={cn('animate-spin', sizeClasses[size], className)} />
  )
}

interface LoadingCardProps {
  title?: string
  lines?: number
  className?: string
}

export function LoadingCard({ title = "Loading...", lines = 3, className }: LoadingCardProps) {
  return (
    <div className={cn('p-6 border rounded-lg space-y-4', className)}>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

interface LoadingButtonProps {
  children: React.ReactNode
  loading?: boolean
  className?: string
}

export function LoadingButton({ children, loading, className, ...props }: any) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-4',
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </button>
  )
}

interface FullPageLoaderProps {
  message?: string
}

export function FullPageLoader({ message = "Loading..." }: FullPageLoaderProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" className="mx-auto" />
        <p className="text-lg text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}

export function TransactionLoader() {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <LoadingSpinner size="sm" />
      <span>Processing transaction...</span>
    </div>
  )
}

export function IdentityVerificationLoader() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <LoadingSpinner />
        <div>
          <p className="font-medium">Verifying Identity</p>
          <p className="text-sm text-muted-foreground">Establishing secure connection...</p>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm">Connecting to Human Passport</span>
        </div>
        <div className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          <span className="text-sm">Encrypting data with Nillion</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <span className="text-sm text-muted-foreground">Generating DID</span>
        </div>
      </div>
    </div>
  )
}

export function AILoader() {
  return (
    <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <LoadingSpinner className="text-blue-600" />
      <div>
        <p className="font-medium text-blue-800">AI Assistant is thinking</p>
        <p className="text-sm text-blue-600">Analyzing your query with privacy-preserving AI...</p>
      </div>
    </div>
  )
}