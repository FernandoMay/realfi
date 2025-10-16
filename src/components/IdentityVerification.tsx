'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Shield, CheckCircle, AlertCircle, Lock } from 'lucide-react'

interface IdentityData {
  passportId?: string
  verifiedAt?: string
  uniquenessScore?: number
  sybilResistance?: boolean
  storageId?: string
  did?: string
}

export default function IdentityVerification() {
  const [isLoading, setIsLoading] = useState(false)
  const [identityData, setIdentityData] = useState<IdentityData>({})
  const [error, setError] = useState<string>('')

  const handleVerifyPassport = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify-human-passport',
          data: {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
          }
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setIdentityData(prev => ({ ...prev, ...result.data }))
      } else {
        setError(result.error || 'Verification failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStorePrivateData = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'store-private-data',
          data: {
            preferences: {
              notifications: true,
              privacy: 'maximum',
              dataSharing: false
            },
            timestamp: new Date().toISOString()
          }
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setIdentityData(prev => ({ ...prev, storageId: result.data.storageId }))
      } else {
        setError(result.error || 'Storage failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateDID = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/identity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate-did',
          data: {
            services: ['identity', 'finance', 'governance']
          }
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setIdentityData(prev => ({ ...prev, ...result.data }))
      } else {
        setError(result.error || 'DID generation failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const isVerified = !!identityData.passportId
  const hasStorage = !!identityData.storageId
  const hasDID = !!identityData.did

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-500" />
            Identity Verification Status
          </CardTitle>
          <CardDescription>
            Complete all steps to unlock full RealFi services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {isVerified ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                )}
                <div>
                  <p className="font-medium">Human Passport Verification</p>
                  <p className="text-sm text-muted-foreground">
                    {isVerified ? `Verified: ${identityData.passportId}` : 'Verify your unique identity'}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleVerifyPassport}
                disabled={isVerified || isLoading}
                size="sm"
              >
                {isVerified ? 'Verified' : 'Verify'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {hasStorage ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Lock className="h-5 w-5 text-gray-400" />
                )}
                <div>
                  <p className="font-medium">Private Data Storage</p>
                  <p className="text-sm text-muted-foreground">
                    {hasStorage ? `Storage ID: ${identityData.storageId}` : 'Encrypt and store your data'}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleStorePrivateData}
                disabled={hasStorage || isLoading || !isVerified}
                size="sm"
                variant="outline"
              >
                {hasStorage ? 'Stored' : 'Store Data'}
              </Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {hasDID ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-gray-400" />
                )}
                <div>
                  <p className="font-medium">Decentralized Identifier</p>
                  <p className="text-sm text-muted-foreground">
                    {hasDID ? `DID: ${identityData.did}` : 'Generate your DID'}
                  </p>
                </div>
              </div>
              <Button
                onClick={handleGenerateDID}
                disabled={hasDID || isLoading || !isVerified}
                size="sm"
                variant="outline"
              >
                {hasDID ? 'Generated' : 'Generate DID'}
              </Button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {isVerified && (
            <div className="space-y-3">
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Verification Metrics</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Uniqueness Score:</span>
                    <span className="font-medium">
                      {((identityData.uniquenessScore || 0) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={(identityData.uniquenessScore || 0) * 100} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Sybil Resistance:</span>
                    <Badge variant={identityData.sybilResistance ? 'default' : 'destructive'}>
                      {identityData.sybilResistance ? 'Protected' : 'Not Protected'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isVerified && hasStorage && hasDID && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-800 mb-1">
                Identity Fully Verified!
              </h3>
              <p className="text-sm text-green-600">
                You now have access to all RealFi services with maximum privacy protection.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}