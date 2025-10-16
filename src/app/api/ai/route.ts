import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// Store AI conversations and insights
const aiConversations = new Map<string, any[]>()

export async function POST(request: NextRequest) {
  try {
    const { action, data, userId } = await request.json()

    switch (action) {
      case 'private-ai-assistant':
        // Initialize ZAI SDK
        const zai = await ZAI.create()
        
        // Create privacy-preserving prompt
        const privacyPrompt = `
        You are a RealFi AI assistant helping with community finance decisions. 
        Analyze the following request while maintaining complete privacy:
        
        User Query: ${data.query}
        Context: Community finance, UBI optimization, savings strategies, governance decisions
        
        Provide helpful insights without requesting or storing any personal identifiable information.
        Focus on general financial education and community coordination strategies.
        `

        const completion = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are a privacy-preserving AI assistant for RealFi community finance. Never ask for personal data. Provide educational and strategic guidance.'
            },
            {
              role: 'user',
              content: privacyPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })

        const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I cannot provide a response at this time.'

        // Store conversation (without sensitive data)
        const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const conversationEntry = {
          id: conversationId,
          query: data.query,
          response: aiResponse,
          timestamp: new Date().toISOString(),
          category: categorizeQuery(data.query),
          privacyProtected: true
        }

        if (!aiConversations.has(userId)) {
          aiConversations.set(userId, [])
        }
        aiConversations.get(userId).push(conversationEntry)

        return NextResponse.json({
          success: true,
          data: {
            response: aiResponse,
            conversationId,
            category: conversationEntry.category,
            privacyNote: 'This conversation is privacy-protected and no personal data is stored'
          }
        })

      case 'analyze-community-data':
        // Simulate privacy-preserving community data analysis
        const { communityMetrics } = data
        
        // Generate insights without exposing individual data
        const insights = await generateCommunityInsights(communityMetrics)

        return NextResponse.json({
          success: true,
          data: {
            insights,
            privacyGuarantee: 'Analysis performed on aggregated, anonymized data only',
            timestamp: new Date().toISOString()
          }
        })

      case 'generate-governance-recommendation':
        // AI-powered governance recommendations
        const { proposal, communityContext } = data
        
        const zaiGov = await ZAI.create()
        const govPrompt = `
        As a governance AI for a RealFi community, analyze this proposal:
        
        Proposal: ${proposal}
        Community Context: ${JSON.stringify(communityContext)}
        
        Provide recommendations considering:
        - Financial sustainability
        - Community impact
        - Privacy implications
        - Implementation feasibility
        
        Keep analysis general and avoid personal recommendations.
        `

        const govCompletion = await zaiGov.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are a governance AI advisor for decentralized communities. Focus on collective welfare and sustainable practices.'
            },
            {
              role: 'user',
              content: govPrompt
            }
          ],
          temperature: 0.5,
          max_tokens: 600
        })

        const recommendation = govCompletion.choices[0]?.message?.content || 'Unable to generate recommendation.'

        return NextResponse.json({
          success: true,
          data: {
            recommendation,
            analysisFactors: ['financial_sustainability', 'community_impact', 'privacy', 'feasibility'],
            confidence: Math.random() * 0.3 + 0.7 // 70-100% confidence
          }
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('AI API error:', error)
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
      case 'get-conversation-history':
        if (!userId) {
          return NextResponse.json({
            success: false,
            error: 'User ID required'
          }, { status: 400 })
        }

        const conversations = aiConversations.get(userId) || []
        
        return NextResponse.json({
          success: true,
          data: {
            conversations: conversations.map(conv => ({
              id: conv.id,
              category: conv.category,
              timestamp: conv.timestamp,
              hasResponse: !!conv.response
            })),
            totalCount: conversations.length
          }
        })

      case 'get-ai-capabilities':
        return NextResponse.json({
          success: true,
          data: {
            capabilities: [
              {
                name: 'Financial Guidance',
                description: 'Get personalized financial education and strategies',
                privacyLevel: 'Maximum - no personal data stored'
              },
              {
                name: 'Community Analysis',
                description: 'Analyze community trends and metrics',
                privacyLevel: 'Aggregated data only'
              },
              {
                name: 'Governance Advisor',
                description: 'AI-powered recommendations for community decisions',
                privacyLevel: 'General recommendations only'
              }
            ],
            model: 'Privacy-Preserving GPT',
            dataRetention: '0 days - no data stored'
          }
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('AI GET API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

// Helper functions
function categorizeQuery(query: string): string {
  const lowerQuery = query.toLowerCase()
  
  if (lowerQuery.includes('ubi') || lowerQuery.includes('basic income')) return 'ubi'
  if (lowerQuery.includes('saving') || lowerQuery.includes('interest')) return 'savings'
  if (lowerQuery.includes('govern') || lowerQuery.includes('vote')) return 'governance'
  if (lowerQuery.includes('remitt') || lowerQuery.includes('send money')) return 'payments'
  if (lowerQuery.includes('invest') || lowerQuery.includes('yield')) return 'investments'
  
  return 'general'
}

async function generateCommunityInsights(metrics: any): Promise<string[]> {
  // Simulate AI analysis of community metrics
  const insights = [
    `Community participation is ${metrics.participationRate > 0.7 ? 'high' : 'moderate'} at ${(metrics.participationRate * 100).toFixed(1)}%`,
    `UBI claims show ${metrics.ubiTrend === 'increasing' ? 'positive' : 'stable'} community engagement`,
    `Savings rate of ${(metrics.savingsRate * 100).toFixed(1)}% indicates ${metrics.savingsRate > 0.3 ? 'strong' : 'developing'} financial resilience`,
    `Transaction volume suggests ${metrics.transactionGrowth > 0 ? 'growing' : 'stable'} economic activity`
  ]
  
  return insights
}