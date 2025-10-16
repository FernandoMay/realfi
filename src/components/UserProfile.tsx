'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { User, Shield, Wallet, Brain, Settings, Award, TrendingUp, Calendar } from 'lucide-react'
import { useNotifications } from '@/components/NotificationSystem'

interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  joinDate: string
  verificationLevel: 'basic' | 'verified' | 'premium'
  stats: {
    totalTransactions: number
    totalSaved: number
    aiInteractions: number
    governanceParticipation: number
  }
  achievements: string[]
  preferences: {
    notifications: boolean
    privacy: 'basic' | 'enhanced' | 'maximum'
    theme: 'light' | 'dark' | 'system'
  }
}

export default function UserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { showSuccess, showInfo } = useNotifications()

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      // Simulate loading from API/localStorage
      const savedProfile = localStorage.getItem('userProfile')
      
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile))
      } else {
        // Create default profile
        const defaultProfile: UserProfile = {
          id: `user_${Date.now()}`,
          name: 'RealFi User',
          email: 'user@realfi.community',
          joinDate: new Date().toISOString(),
          verificationLevel: 'basic',
          stats: {
            totalTransactions: 0,
            totalSaved: 0,
            aiInteractions: 0,
            governanceParticipation: 0
          },
          achievements: ['Welcome to RealFi!'],
          preferences: {
            notifications: true,
            privacy: 'maximum',
            theme: 'system'
          }
        }
        setProfile(defaultProfile)
        localStorage.setItem('userProfile', JSON.stringify(defaultProfile))
      }
    } catch (error) {
      console.error('Failed to load user profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!profile) return
    
    const updatedProfile = { ...profile, ...updates }
    setProfile(updatedProfile)
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile))
    showSuccess('Profile Updated', 'Your changes have been saved successfully.')
  }

  const updatePreferences = (key: string, value: any) => {
    if (!profile) return
    
    updateProfile({
      preferences: {
        ...profile.preferences,
        [key]: value
      }
    })
  }

  const getVerificationColor = (level: string) => {
    switch (level) {
      case 'premium': return 'bg-purple-100 text-purple-800'
      case 'verified': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!profile) return null

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profile.avatar} />
                <AvatarFallback className="text-lg">
                  {getInitials(profile.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {profile.name}
                  <Badge className={getVerificationColor(profile.verificationLevel)}>
                    {profile.verificationLevel}
                  </Badge>
                </CardTitle>
                <CardDescription>{profile.email}</CardDescription>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Calendar className="h-3 w-3" />
                  Joined {new Date(profile.joinDate).toLocaleDateString()}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{profile.stats.totalTransactions}</p>
                <p className="text-xs text-muted-foreground">Transactions</p>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">G$ {profile.stats.totalSaved}</p>
                <p className="text-xs text-muted-foreground">Total Saved</p>
              </div>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{profile.stats.aiInteractions}</p>
                <p className="text-xs text-muted-foreground">AI Chats</p>
              </div>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{profile.stats.governanceParticipation}</p>
                <p className="text-xs text-muted-foreground">Votes Cast</p>
              </div>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="achievements" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Your Achievements
              </CardTitle>
              <CardDescription>
                Milestones and badges you've earned on your RealFi journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {profile.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <Award className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">{achievement}</p>
                      <p className="text-sm text-muted-foreground">Achievement unlocked!</p>
                    </div>
                  </div>
                ))}
                
                {/* Locked achievements */}
                <div className="flex items-center gap-3 p-3 border rounded-lg opacity-50">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium">Power Saver</p>
                    <p className="text-sm text-muted-foreground">Save G$ 1000</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 border rounded-lg opacity-50">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Award className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium">AI Expert</p>
                    <p className="text-sm text-muted-foreground">50 AI interactions</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest transactions and interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Wallet className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Daily UBI Claimed</p>
                      <p className="text-sm text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <span className="text-green-600 font-medium">+G$ 10</span>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Brain className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">AI Assistant Query</p>
                      <p className="text-sm text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                  <Badge variant="outline">AI</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <Shield className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">Voted on Proposal</p>
                      <p className="text-sm text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <Badge variant="outline">Governance</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Customize your RealFi experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates about your account</p>
                  </div>
                  <Button
                    variant={profile.preferences.notifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => updatePreferences('notifications', !profile.preferences.notifications)}
                  >
                    {profile.preferences.notifications ? 'Enabled' : 'Disabled'}
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Privacy Level</p>
                    <p className="text-sm text-muted-foreground">Control your data privacy settings</p>
                  </div>
                  <select
                    value={profile.preferences.privacy}
                    onChange={(e) => updatePreferences('privacy', e.target.value)}
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    <option value="basic">Basic</option>
                    <option value="enhanced">Enhanced</option>
                    <option value="maximum">Maximum</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Theme</p>
                    <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                  </div>
                  <select
                    value={profile.preferences.theme}
                    onChange={(e) => updatePreferences('theme', e.target.value)}
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}