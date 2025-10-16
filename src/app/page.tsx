'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Shield, Users, Wallet, Brain, Globe, Lock, Zap, Heart, User, Settings, Bell, Network } from 'lucide-react'
import IdentityVerification from '@/components/IdentityVerification'
import FinanceDashboard from '@/components/FinanceDashboard'
import AIAssistant from '@/components/AIAssistant'
import UserProfile from '@/components/UserProfile'
import { IntegrationsDashboard } from '@/components/IntegrationsDashboard'
import { useRealTimeUpdates, ConnectionStatus, LivePriceTicker } from '@/components/RealTimeUpdates'
import { MobileNav, MobileBottomNav } from '@/components/MobileOptimizations'
import { PWABadge } from '@/components/PWAInstaller'
import { useNotifications } from '@/components/NotificationSystem'
import { storage } from '@/lib/storage'
import { LoadingSpinner } from '@/components/LoadingStates'

export default function Home() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const { isConnected } = useRealTimeUpdates()
  const { showSuccess } = useNotifications()

  useEffect(() => {
    // Initialize user data
    const initializeApp = async () => {
      try {
        // Load user from storage
        const savedUser = storage.get('user')
        
        if (savedUser) {
          setUser(savedUser)
        } else {
          // Create new user
          const newUser = {
            id: `user_${Date.now()}`,
            name: 'RealFi User',
            email: 'user@realfi.community',
            joinDate: new Date().toISOString(),
            verificationLevel: 'basic',
            isFirstTime: true
          }
          storage.set('user', newUser)
          setUser(newUser)
          
          // Show welcome notification
          setTimeout(() => {
            showSuccess('Welcome to RealFi!', 'Your privacy-first financial journey begins now.')
          }, 2000)
        }
      } catch (error) {
        console.error('Failed to initialize app:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [showSuccess])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" className="mx-auto" />
          <h2 className="text-xl font-semibold">Loading RealFi Hub...</h2>
          <p className="text-muted-foreground">Preparing your secure financial ecosystem</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pb-16 md:pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Status */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <MobileNav>
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  RealFi Hub
                </h1>
              </div>
            </MobileNav>
            
            <div className="flex items-center gap-3">
              <ConnectionStatus />
              <PWABadge />
            </div>
          </div>
          
          <div className="flex justify-center items-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              RealFi Community Trust Hub
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Building the future of community finance with privacy-preserving identity, 
            secure onboarding, and AI-powered coordination tools.
          </p>
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            <Badge variant="secondary">Human Protocol</Badge>
            <Badge variant="secondary">Nillion</Badge>
            <Badge variant="secondary">GoodDollar</Badge>
            <Badge variant="secondary">EdgeCity</Badge>
            <Badge variant="secondary">Logos</Badge>
            <Badge variant="secondary">Numbers Protocol</Badge>
            <Badge variant="secondary">Internet Archive</Badge>
            <Badge variant="secondary">Tor Project</Badge>
            <Badge variant="secondary">Bento</Badge>
            <Badge variant="secondary">RealFi Hack 2024</Badge>
          </div>
        </div>

        {/* Live Price Ticker */}
        <div className="mb-6">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="py-3">
              <LivePriceTicker />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-6 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="identity">Identity</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
            <TabsTrigger value="coordination">Coordination</TabsTrigger>
            <TabsTrigger value="integrations">Web3 Hub</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-blue-500" />
                    <CardTitle>Privacy-First Identity</CardTitle>
                  </div>
                  <CardDescription>
                    Verify your identity without compromising privacy using Human Passport and Nillion's encrypted storage.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">Get Started</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Wallet className="h-6 w-6 text-green-500" />
                    <CardTitle>Smart Wallet Access</CardTitle>
                  </div>
                  <CardDescription>
                    Onboard seamlessly with Human Wallet and access DeFi, UBI, and community financial services.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">Connect Wallet</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Brain className="h-6 w-6 text-purple-500" />
                    <CardTitle>AI-Powered Insights</CardTitle>
                  </div>
                  <CardDescription>
                    Get personalized financial guidance with privacy-preserving AI that never sees your raw data.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">Try AI Assistant</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-6 w-6 text-orange-500" />
                    <CardTitle>Community Governance</CardTitle>
                  </div>
                  <CardDescription>
                    Participate in collective decision-making with transparent voting and resource allocation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">Join Community</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe className="h-6 w-6 text-cyan-500" />
                    <CardTitle>Global Remittances</CardTitle>
                  </div>
                  <CardDescription>
                    Send and receive funds across borders with minimal fees and maximum privacy.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">Send Money</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lock className="h-6 w-6 text-red-500" />
                    <CardTitle>Secure Storage</CardTitle>
                  </div>
                  <CardDescription>
                    Store sensitive documents and data with military-grade encryption and zero-knowledge proofs.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full" variant="outline">Secure Data</Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Network className="h-6 w-6 text-purple-600" />
                    <CardTitle>Web3 Integration Hub</CardTitle>
                  </div>
                  <CardDescription>
                    Access 9+ integrated Web3 protocols for identity, finance, privacy, and infrastructure in one unified platform.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Explore Integrations
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="identity" className="space-y-6">
            <IdentityVerification />
          </TabsContent>

          <TabsContent value="finance" className="space-y-6">
            <FinanceDashboard />
          </TabsContent>

          <TabsContent value="coordination" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <AIAssistant />
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-6 w-6" />
                    Community Governance
                  </CardTitle>
                  <CardDescription>
                    Participate in collective decision-making and resource allocation
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">Active Proposals</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Community Fund Allocation</span>
                          <Badge>2 days left</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Governance Framework Update</span>
                          <Badge>5 days left</Badge>
                        </div>
                      </div>
                      <Button className="w-full mt-3" variant="outline">View All Proposals</Button>
                    </div>
                    
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-semibold mb-2">Your Participation</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Votes Cast:</span>
                          <span className="font-medium">3</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Proposals Created:</span>
                          <span className="font-medium">1</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Reputation Score:</span>
                          <span className="font-medium text-green-600">High</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-6">
            <IntegrationsDashboard />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <UserProfile />
          </TabsContent>
        </Tabs>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </div>
  )
}