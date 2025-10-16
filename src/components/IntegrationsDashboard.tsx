'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Shield, Users, Wallet, Brain, Globe, Lock, Zap, Heart, User, Settings, Bell,
  Database, Cloud, Fingerprint, Camera, Archive, Eye, Network, Link2,
  CheckCircle, AlertCircle, Clock, TrendingUp, Activity, Server, Cpu,
  HardDrive, Wifi, Key, FileText, Award, Star, BarChart3, PieChart
} from 'lucide-react'
import { integrationManager, integrations } from '@/lib/integrations'
import { useNotifications } from '@/components/NotificationSystem'

interface IntegrationStatus {
  connected: boolean
  features: string[]
  lastChecked: string
}

interface DashboardData {
  identity: any
  finance: any
  privacy: any
  infrastructure: any
  reputation: any
}

export function IntegrationsDashboard() {
  const [status, setStatus] = useState<Record<string, IntegrationStatus>>({})
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null)
  const { showSuccess, showError, showInfo } = useNotifications()

  useEffect(() => {
    loadDashboardData()
    const interval = setInterval(loadDashboardData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const [statusData, dashboardData] = await Promise.all([
        integrationManager.getAllStatus(),
        integrationManager.getDashboardData()
      ])
      
      setStatus(statusData)
      setDashboardData(dashboardData)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
      showError('Dashboard Error', 'Failed to load integration data')
    } finally {
      setLoading(false)
    }
  }

  const handleIntegrationAction = async (integration: string, action: string) => {
    try {
      showInfo('Processing', `${action} on ${integration}...`)
      
      switch (integration) {
        case 'humanProtocol':
          if (action === 'verify') {
            const result = await integrations.humanProtocol.getVerificationStats()
            showSuccess('Human Protocol', `Connected to ${result.totalVerified.toLocaleString()} verified humans`)
          }
          break
          
        case 'goodDollar':
          if (action === 'claim') {
            const stats = await integrations.goodDollar.getUBIStats()
            showSuccess('GoodDollar', `UBI active in ${stats.countriesReached} countries`)
          }
          break
          
        case 'nillion':
          if (action === 'store') {
            const stats = await integrations.nillion.getNetworkStats()
            showSuccess('Nillion', `${stats.privacyScore * 100}% privacy score achieved`)
          }
          break
          
        case 'torProject':
          if (action === 'connect') {
            const connection = await integrations.torProject.initializeTor()
            showSuccess('Tor Project', `Connected via ${connection.exitNode.country}`)
          }
          break
          
        case 'edgeCity':
          if (action === 'deploy') {
            const nodes = await integrations.edgeCity.getAvailableNodes()
            showSuccess('EdgeCity', `${nodes.length} edge nodes available`)
          }
          break
          
        case 'logos':
          if (action === 'register') {
            const stats = await integrations.logos.getNetworkStats()
            showSuccess('Logos', `${stats.totalNames.toLocaleString()} decentralized names`)
          }
          break
          
        case 'numbersProtocol':
          if (action === 'verify') {
            const stats = await integrations.numbersProtocol.getNetworkStats()
            showSuccess('Numbers Protocol', `${(stats.averageVerificationScore * 100).toFixed(1)}% verification accuracy`)
          }
          break
          
        case 'internetArchive':
          if (action === 'archive') {
            const stats = await integrations.internetArchive.getNetworkStats()
            showSuccess('Internet Archive', `${stats.totalItems.toLocaleString()} items preserved`)
          }
          break
          
        case 'bento':
          if (action === 'profile') {
            const stats = await integrations.bento.getNetworkStats()
            showSuccess('Bento', `${stats.totalProfiles.toLocaleString()} professional profiles`)
          }
          break
      }
      
      await loadDashboardData() // Refresh data
    } catch (error) {
      console.error('Integration action failed:', error)
      showError('Action Failed', `Failed to ${action} on ${integration}`)
    }
  }

  const getIntegrationIcon = (integration: string) => {
    const icons = {
      humanProtocol: <Fingerprint className="h-5 w-5" />,
      goodDollar: <Heart className="h-5 w-5" />,
      nillion: <Lock className="h-5 w-5" />,
      torProject: <Eye className="h-5 w-5" />,
      edgeCity: <Cloud className="h-5 w-5" />,
      logos: <FileText className="h-5 w-5" />,
      numbersProtocol: <Camera className="h-5 w-5" />,
      internetArchive: <Archive className="h-5 w-5" />,
      bento: <User className="h-5 w-5" />
    }
    return icons[integration as keyof typeof icons] || <Globe className="h-5 w-5" />
  }

  const getIntegrationColor = (integration: string) => {
    const colors = {
      humanProtocol: 'text-blue-600 bg-blue-50 border-blue-200',
      goodDollar: 'text-green-600 bg-green-50 border-green-200',
      nillion: 'text-purple-600 bg-purple-50 border-purple-200',
      torProject: 'text-gray-600 bg-gray-50 border-gray-200',
      edgeCity: 'text-cyan-600 bg-cyan-50 border-cyan-200',
      logos: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      numbersProtocol: 'text-orange-600 bg-orange-50 border-orange-200',
      internetArchive: 'text-red-600 bg-red-50 border-red-200',
      bento: 'text-pink-600 bg-pink-50 border-pink-200'
    }
    return colors[integration as keyof typeof colors] || 'text-gray-600 bg-gray-50 border-gray-200'
  }

  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <Activity className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading Web3 Integrations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center items-center gap-2">
          <Network className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold">Web3 Integrations Hub</h2>
        </div>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Complete decentralized ecosystem with 9+ integrated Web3 technologies for identity, finance, privacy, and infrastructure.
        </p>
        <div className="flex justify-center gap-2 flex-wrap">
          <Badge variant="secondary">Human Protocol</Badge>
          <Badge variant="secondary">Nillion</Badge>
          <Badge variant="secondary">GoodDollar</Badge>
          <Badge variant="secondary">EdgeCity</Badge>
          <Badge variant="secondary">Logos</Badge>
          <Badge variant="secondary">Numbers Protocol</Badge>
          <Badge variant="secondary">Internet Archive</Badge>
          <Badge variant="secondary">Tor Project</Badge>
          <Badge variant="secondary">Bento</Badge>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium">Connected</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {Object.values(status).filter(s => s.connected).length}
            </div>
            <div className="text-xs text-muted-foreground">Integrations</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium">Total Features</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {Object.values(status).reduce((acc, s) => acc + s.features.length, 0)}
            </div>
            <div className="text-xs text-muted-foreground">Available</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Network Health</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">
              {dashboardData ? Math.round(
                (Object.values(status).filter(s => s.connected).length / Object.keys(status).length) * 100
              ) : 0}%
            </div>
            <div className="text-xs text-muted-foreground">Operational</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium">Last Update</span>
            </div>
            <div className="text-sm font-bold text-orange-600">
              {new Date().toLocaleTimeString()}
            </div>
            <div className="text-xs text-muted-foreground">Auto-refresh</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="identity">Identity</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="infrastructure">Infrastructure</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(status).map(([integration, integrationStatus]) => (
              <Card 
                key={integration} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedIntegration === integration ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setSelectedIntegration(
                  selectedIntegration === integration ? null : integration
                )}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg ${getIntegrationColor(integration)}`}>
                      {getIntegrationIcon(integration)}
                    </div>
                    <Badge variant={integrationStatus.connected ? 'default' : 'secondary'}>
                      {integrationStatus.connected ? 'Connected' : 'Offline'}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg capitalize">
                    {integration.replace(/([A-Z])/g, ' $1').trim()}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Features:</div>
                    <div className="flex flex-wrap gap-1">
                      {integrationStatus.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {integrationStatus.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{integrationStatus.features.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleIntegrationAction(integration, 'status')
                      }}
                    >
                      <Activity className="h-3 w-3 mr-1" />
                      Status
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation()
                        const actions = {
                          humanProtocol: 'verify',
                          goodDollar: 'claim',
                          nillion: 'store',
                          torProject: 'connect',
                          edgeCity: 'deploy',
                          logos: 'register',
                          numbersProtocol: 'verify',
                          internetArchive: 'archive',
                          bento: 'profile'
                        }
                        handleIntegrationAction(integration, actions[integration as keyof typeof actions])
                      }}
                    >
                      <Zap className="h-3 w-3 mr-1" />
                      Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="identity" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fingerprint className="h-5 w-5 text-blue-500" />
                  Human Protocol
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Verified Humans</span>
                    <span className="font-medium">
                      {dashboardData?.identity?.humanProtocol?.totalVerified?.toLocaleString() || '125,000'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Uniqueness Score</span>
                    <span className="font-medium">
                      {(dashboardData?.identity?.humanProtocol?.avgUniquenessScore * 100)?.toFixed(1) || '85'}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Sybil Resistance</span>
                    <span className="font-medium">
                      {(dashboardData?.identity?.humanProtocol?.sybilResistanceRate * 100)?.toFixed(1) || '97'}%
                    </span>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleIntegrationAction('humanProtocol', 'verify')}
                >
                  Verify Identity
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-500" />
                  Logos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Names</span>
                    <span className="font-medium">
                      {dashboardData?.identity?.logos?.totalNames?.toLocaleString() || '125,000'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Active Identities</span>
                    <span className="font-medium">
                      {dashboardData?.identity?.logos?.activeIdentities?.toLocaleString() || '87,000'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Endorsements</span>
                    <span className="font-medium">
                      {dashboardData?.identity?.logos?.totalEndorsements?.toLocaleString() || '450,000'}
                    </span>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleIntegrationAction('logos', 'register')}
                >
                  Register Name
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-pink-500" />
                  Bento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Profiles</span>
                    <span className="font-medium">
                      {dashboardData?.identity?.bento?.totalProfiles?.toLocaleString() || '2.5M'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Active Profiles</span>
                    <span className="font-medium">
                      {dashboardData?.identity?.bento?.activeProfiles?.toLocaleString() || '1.9M'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Connections</span>
                    <span className="font-medium">
                      {dashboardData?.identity?.bento?.totalConnections?.toLocaleString() || '12.5M'}
                    </span>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleIntegrationAction('bento', 'profile')}
                >
                  Create Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="finance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-green-500" />
                GoodDollar Universal Basic Income
              </CardTitle>
              <CardDescription>
                Decentralized UBI distribution and financial inclusion worldwide
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ${dashboardData?.finance?.goodDollar?.totalDistributed || '250M'}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Distributed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {dashboardData?.finance?.goodDollar?.activeClaimers?.toLocaleString() || '250K'}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Claimers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    G$ {dashboardData?.finance?.goodDollar?.averageDailyClaim || '10'}
                  </div>
                  <div className="text-sm text-muted-foreground">Daily Claim</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {dashboardData?.finance?.goodDollar?.countriesReached || '180'}
                  </div>
                  <div className="text-sm text-muted-foreground">Countries Reached</div>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  className="flex-1" 
                  onClick={() => handleIntegrationAction('goodDollar', 'claim')}
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  Claim Daily UBI
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleIntegrationAction('goodDollar', 'savings')}
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Open Savings
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-purple-500" />
                  Nillion - Private Computation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Storage</span>
                    <span className="font-medium">
                      {(dashboardData?.privacy?.nillion?.totalStorage / 1000000000)?.toFixed(2) || '1.25'} GB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Active Computations</span>
                    <span className="font-medium">
                      {dashboardData?.privacy?.nillion?.activeComputations || '42'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Privacy Score</span>
                    <span className="font-medium">
                      {(dashboardData?.privacy?.nillion?.privacyScore * 100)?.toFixed(1) || '98'}%
                    </span>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleIntegrationAction('nillion', 'store')}
                >
                  Store Private Data
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-gray-500" />
                  Tor Project - Anonymous Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Network Nodes</span>
                    <span className="font-medium">
                      {dashboardData?.privacy?.tor?.totalNodes?.toLocaleString() || '7,500'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Active Connections</span>
                    <span className="font-medium">
                      {dashboardData?.privacy?.tor?.activeConnections?.toLocaleString() || '2.5M'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Network Uptime</span>
                    <span className="font-medium">
                      {dashboardData?.privacy?.tor?.uptime || '99.8'}%
                    </span>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleIntegrationAction('torProject', 'connect')}
                >
                  Connect Anonymously
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="infrastructure" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-cyan-500" />
                  EdgeCity - Global Edge Network
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Nodes</span>
                    <span className="font-medium">
                      {dashboardData?.infrastructure?.edgeCity?.totalNodes || '127'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Online Nodes</span>
                    <span className="font-medium">
                      {dashboardData?.infrastructure?.edgeCity?.onlineNodes || '124'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Latency</span>
                    <span className="font-medium">
                      {dashboardData?.infrastructure?.edgeCity?.averageLatency || '45'}ms
                    </span>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleIntegrationAction('edgeCity', 'deploy')}
                >
                  Deploy to Edge
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="h-5 w-5 text-red-500" />
                  Internet Archive - Permanent Storage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Total Items</span>
                    <span className="font-medium">
                      {dashboardData?.infrastructure?.internetArchive?.totalItems?.toLocaleString() || '85B'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Storage Size</span>
                    <span className="font-medium">
                      {dashboardData?.infrastructure?.internetArchive?.totalSize || '99'} PB
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Integrity</span>
                    <span className="font-medium">
                      {dashboardData?.infrastructure?.internetArchive?.averageIntegrity || '99.7'}%
                    </span>
                  </div>
                </div>
                <Button 
                  className="w-full" 
                  onClick={() => handleIntegrationAction('internetArchive', 'archive')}
                >
                  Archive Content
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-orange-500" />
                Numbers Protocol - Asset Verification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {dashboardData?.reputation?.numbersProtocol?.totalAssets?.toLocaleString() || '2.5B'}
                  </div>
                  <div className="text-sm text-muted-foreground">Verified Assets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {dashboardData?.reputation?.numbersProtocol?.certificatesIssued?.toLocaleString() || '3.2M'}
                  </div>
                  <div className="text-sm text-muted-foreground">Certificates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(dashboardData?.reputation?.numbersProtocol?.averageVerificationScore * 100)?.toFixed(1) || '87'}%
                  </div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {dashboardData?.reputation?.numbersProtocol?.supportedFormats?.length || '7'}
                  </div>
                  <div className="text-sm text-muted-foreground">Formats</div>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={() => handleIntegrationAction('numbersProtocol', 'verify')}
              >
                <Award className="h-4 w-4 mr-2" />
                Verify Asset
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Selected Integration Detail Modal */}
      {selectedIntegration && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {getIntegrationIcon(selectedIntegration)}
                <span className="capitalize">
                  {selectedIntegration.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedIntegration(null)}
              >
                ✕
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Available Features:</h4>
                <div className="flex flex-wrap gap-2">
                  {status[selectedIntegration]?.features.map((feature, index) => (
                    <Badge key={index} variant="secondary">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Connection Status:</h4>
                <div className="flex items-center gap-2">
                  {status[selectedIntegration]?.connected ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">
                    {status[selectedIntegration]?.connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Last checked: {new Date(status[selectedIntegration]?.lastChecked).toLocaleString()}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleIntegrationAction(selectedIntegration, 'status')}
                >
                  <Activity className="h-3 w-3 mr-1" />
                  Check Status
                </Button>
                <Button 
                  size="sm"
                  onClick={() => {
                    const actions = {
                      humanProtocol: 'verify',
                      goodDollar: 'claim',
                      nillion: 'store',
                      torProject: 'connect',
                      edgeCity: 'deploy',
                      logos: 'register',
                      numbersProtocol: 'verify',
                      internetArchive: 'archive',
                      bento: 'profile'
                    }
                    handleIntegrationAction(selectedIntegration, actions[selectedIntegration as keyof typeof actions])
                  }}
                >
                  <Zap className="h-3 w-3 mr-1" />
                  Test Integration
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}