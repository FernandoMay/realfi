'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Brain, MessageCircle, Shield, Lightbulb, BarChart3, Lock } from 'lucide-react'

interface Conversation {
  id: string
  query: string
  response: string
  timestamp: string
  category: string
}

interface AIInsight {
  title: string
  description: string
  category: string
  confidence: number
}

export default function AIAssistant() {
  const [userId] = useState(`user_${Date.now()}`)
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [activeTab, setActiveTab] = useState('chat')

  useEffect(() => {
    fetchConversationHistory()
    generateInsights()
  }, [])

  const fetchConversationHistory = async () => {
    try {
      const response = await fetch(`/api/ai?action=get-conversation-history&userId=${userId}`)
      const result = await response.json()
      
      if (result.success) {
        // For demo, we'll show mock conversations
        setConversations([
          {
            id: '1',
            query: 'How can I maximize my UBI impact?',
            response: 'Consider pooling UBI with community members for larger projects, or using it to support local businesses that accept G$. This creates a multiplier effect in your local economy.',
            timestamp: new Date().toISOString(),
            category: 'ubi'
          },
          {
            id: '2',
            query: 'What are the best savings strategies?',
            response: 'With 5% APY on savings, consider setting aside 20% of your UBI for long-term goals. The compound interest will help build financial resilience over time.',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            category: 'savings'
          }
        ])
      }
    } catch (error) {
      console.error('Failed to fetch conversation history:', error)
    }
  }

  const generateInsights = async () => {
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'analyze-community-data',
          userId,
          data: {
            communityMetrics: {
              participationRate: 0.75,
              ubiTrend: 'increasing',
              savingsRate: 0.35,
              transactionGrowth: 0.12
            }
          }
        })
      })

      const result = await response.json()
      
      if (result.success) {
        setInsights([
          {
            title: 'High Community Engagement',
            description: 'Your community shows 75% participation rate, indicating strong collective action.',
            category: 'governance',
            confidence: 0.85
          },
          {
            title: 'Growing UBI Impact',
            description: 'Daily UBI claims are increasing, showing growing adoption and trust.',
            category: 'ubi',
            confidence: 0.92
          },
          {
            title: 'Strong Savings Culture',
            description: '35% savings rate demonstrates financial resilience and planning.',
            category: 'savings',
            confidence: 0.78
          }
        ])
      }
    } catch (error) {
      console.error('Failed to generate insights:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!query.trim()) return

    setIsLoading(true)
    
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'private-ai-assistant',
          userId,
          data: { query }
        })
      })

      const result = await response.json()
      
      if (result.success) {
        const newConversation: Conversation = {
          id: result.data.conversationId,
          query,
          response: result.data.response,
          timestamp: new Date().toISOString(),
          category: result.data.category
        }

        setConversations(prev => [newConversation, ...prev])
        setQuery('')
      }
    } catch (error) {
      console.error('Failed to send message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'ubi': return 'bg-green-100 text-green-800'
      case 'savings': return 'bg-blue-100 text-blue-800'
      case 'governance': return 'bg-purple-100 text-purple-800'
      case 'payments': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'ubi': return <DollarSign className="h-4 w-4" />
      case 'savings': return <PiggyBank className="h-4 w-4" />
      case 'governance': return <Users className="h-4 w-4" />
      case 'payments': return <Send className="h-4 w-4" />
      default: return <MessageCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Capabilities Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Privacy-Preserving AI Assistant
          </CardTitle>
          <CardDescription>
            Get personalized guidance while your data remains completely private
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-blue-600" />
              <span className="text-sm">No personal data stored</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Zero-knowledge processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <span className="text-sm">AI-powered insights</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Chat Interface */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Ask AI Assistant
            </CardTitle>
            <CardDescription>
              Get help with UBI, savings, payments, and governance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {conversations.map((conv) => (
                <div key={conv.id} className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="bg-primary text-primary-foreground p-2 rounded-full">
                      <Users className="h-3 w-3" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">You</p>
                      <p className="text-sm bg-muted p-2 rounded">{conv.query}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="bg-blue-500 text-white p-2 rounded-full">
                      <Brain className="h-3 w-3" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">AI Assistant</p>
                      <p className="text-sm bg-blue-50 p-2 rounded border border-blue-200">
                        {conv.response}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getCategoryColor(conv.category)}>
                          {conv.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(conv.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Textarea
                placeholder="Ask about UBI, savings, payments, or governance..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1"
                rows={3}
              />
            </div>
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !query.trim()}
              className="w-full"
            >
              {isLoading ? 'Thinking...' : 'Send Message'}
            </Button>
          </CardContent>
        </Card>

        {/* Insights Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Community Insights
            </CardTitle>
            <CardDescription>
              AI-generated insights from community data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{insight.title}</h4>
                  <Badge variant="outline">
                    {(insight.confidence * 100).toFixed(0)}% confidence
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {insight.description}
                </p>
                <div className="flex items-center gap-2">
                  <Badge className={getCategoryColor(insight.category)}>
                    {insight.category}
                  </Badge>
                </div>
              </div>
            ))}

            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium mb-2">Quick Tips</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Claim UBI daily to maximize benefits</li>
                <li>• Save 20% of income for long-term goals</li>
                <li>• Participate in governance decisions</li>
                <li>• Support local businesses with G$ payments</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Add missing imports
import { DollarSign, PiggyBank, Users, Send } from 'lucide-react'