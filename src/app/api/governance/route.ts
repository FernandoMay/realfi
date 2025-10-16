import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

// Mock governance data
const proposals = new Map<string, any>()
const votes = new Map<string, any>()
const communityGoals = new Map<string, any>()

// Initialize sample community goals
communityGoals.set('solar-project', {
  id: 'solar-project',
  title: 'Community Solar Project',
  description: 'Install solar panels for community energy independence',
  targetAmount: 50000,
  currentAmount: 37500,
  contributors: 45,
  deadline: new Date('2024-12-31').toISOString(),
  category: 'infrastructure'
})

communityGoals.set('food-coop', {
  id: 'food-coop',
  title: 'Local Food Cooperative',
  description: 'Establish community-owned food distribution network',
  targetAmount: 25000,
  currentAmount: 15000,
  contributors: 32,
  deadline: new Date('2024-11-30').toISOString(),
  category: 'food_security'
})

communityGoals.set('education-fund', {
  id: 'education-fund',
  title: 'Education Fund',
  description: 'Support community education and skill development',
  targetAmount: 15000,
  currentAmount: 13500,
  contributors: 28,
  deadline: new Date('2024-10-31').toISOString(),
  category: 'education'
})

export async function POST(request: NextRequest) {
  try {
    const { action, data, userId } = await request.json()

    switch (action) {
      case 'create-proposal':
        // Create new governance proposal
        const proposalId = `prop_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        const newProposal = {
          id: proposalId,
          title: data.title,
          description: data.description,
          category: data.category,
          author: userId,
          createdAt: new Date().toISOString(),
          status: 'active',
          votingDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          votes: { for: 0, against: 0, abstain: 0 },
          quorum: Math.floor(Math.random() * 20) + 10, // 10-30 votes needed
          budget: data.budget || 0
        }

        proposals.set(proposalId, newProposal)

        return NextResponse.json({
          success: true,
          data: {
            proposal: newProposal,
            message: 'Proposal created successfully'
          }
        })

      case 'vote':
        // Vote on a proposal
        const { proposalId: propId, voteType, reason } = data
        
        if (!proposals.has(propId)) {
          return NextResponse.json({
            success: false,
            error: 'Proposal not found'
          }, { status: 404 })
        }

        const existingProposal = proposals.get(propId)
        
        // Check if user already voted
        if (votes.has(`${propId}_${userId}`)) {
          return NextResponse.json({
            success: false,
            error: 'You have already voted on this proposal'
          }, { status: 400 })
        }

        // Check voting deadline
        if (new Date() > new Date(existingProposal.votingDeadline)) {
          return NextResponse.json({
            success: false,
            error: 'Voting period has ended'
          }, { status: 400 })
        }

        // Record vote
        const vote = {
          proposalId: propId,
          userId,
          voteType, // 'for', 'against', 'abstain'
          reason: reason || '',
          timestamp: new Date().toISOString()
        }

        votes.set(`${propId}_${userId}`, vote)
        
        // Update proposal vote counts
        existingProposal.votes[voteType]++
        proposals.set(propId, existingProposal)

        return NextResponse.json({
          success: true,
          data: {
            vote,
            currentVotes: existingProposal.votes,
            message: `Vote recorded: ${voteType}`
          }
        })

      case 'contribute-to-goal':
        // Contribute to community goal
        const { goalId, amount } = data
        
        if (!communityGoals.has(goalId)) {
          return NextResponse.json({
            success: false,
            error: 'Community goal not found'
          }, { status: 404 })
        }

        const goal = communityGoals.get(goalId)
        const contributionId = `contrib_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        const contribution = {
          id: contributionId,
          goalId,
          userId,
          amount,
          timestamp: new Date().toISOString(),
          anonymous: data.anonymous || false
        }

        // Update goal
        goal.currentAmount += amount
        goal.contributors += 1
        communityGoals.set(goalId, goal)

        return NextResponse.json({
          success: true,
          data: {
            contribution,
            updatedGoal: goal,
            percentageFunded: (goal.currentAmount / goal.targetAmount * 100).toFixed(1),
            message: `Contributed G$ ${amount} to ${goal.title}`
          }
        })

      case 'execute-proposal':
        // Execute an approved proposal
        const { proposalId: execPropId } = data
        const execProposal = proposals.get(execPropId)
        
        if (!execProposal) {
          return NextResponse.json({
            success: false,
            error: 'Proposal not found'
          }, { status: 404 })
        }

        // Check if proposal passed
        const totalVotes = execProposal.votes.for + execProposal.votes.against + execProposal.votes.abstain
        const passed = totalVotes >= execProposal.quorum && execProposal.votes.for > execProposal.votes.against

        if (!passed) {
          return NextResponse.json({
            success: false,
            error: 'Proposal did not pass voting requirements'
          }, { status: 400 })
        }

        // Execute proposal
        execProposal.status = 'executed'
        execProposal.executedAt = new Date().toISOString()
        proposals.set(execPropId, execProposal)

        return NextResponse.json({
          success: true,
          data: {
            proposal: execProposal,
            executionId: `exec_${Date.now()}`,
            message: 'Proposal executed successfully'
          }
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Governance API error:', error)
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
      case 'get-proposals':
        const proposalList = Array.from(proposals.values())
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        return NextResponse.json({
          success: true,
          data: {
            proposals: proposalList,
            totalCount: proposalList.length
          }
        })

      case 'get-proposal':
        const proposalId = searchParams.get('id')
        if (!proposalId) {
          return NextResponse.json({
            success: false,
            error: 'Proposal ID required'
          }, { status: 400 })
        }

        const proposal = proposals.get(proposalId)
        if (!proposal) {
          return NextResponse.json({
            success: false,
            error: 'Proposal not found'
          }, { status: 404 })
        }

        // Check if user voted
        const userVote = votes.get(`${proposalId}_${userId}`)

        return NextResponse.json({
          success: true,
          data: {
            proposal,
            userVote,
            canVote: !userVote && new Date() < new Date(proposal.votingDeadline),
            votingEnds: proposal.votingDeadline
          }
        })

      case 'get-community-goals':
        const goals = Array.from(communityGoals.values())
          .map(goal => ({
            ...goal,
            percentageFunded: (goal.currentAmount / goal.targetAmount * 100).toFixed(1),
            daysRemaining: Math.ceil((new Date(goal.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          }))

        return NextResponse.json({
          success: true,
          data: {
            goals,
            totalRaised: goals.reduce((sum, goal) => sum + goal.currentAmount, 0),
            totalTarget: goals.reduce((sum, goal) => sum + goal.targetAmount, 0)
          }
        })

      case 'get-user-votes':
        if (!userId) {
          return NextResponse.json({
            success: false,
            error: 'User ID required'
          }, { status: 400 })
        }

        const userVotes = Array.from(votes.entries())
          .filter(([key, vote]) => vote.userId === userId)
          .map(([key, vote]) => vote)

        return NextResponse.json({
          success: true,
          data: {
            votes: userVotes,
            totalVotes: userVotes.length
          }
        })

      case 'get-governance-stats':
        const allProposals = Array.from(proposals.values())
        const activeProposals = allProposals.filter(p => p.status === 'active')
        const executedProposals = allProposals.filter(p => p.status === 'executed')

        return NextResponse.json({
          success: true,
          data: {
            totalProposals: allProposals.length,
            activeProposals: activeProposals.length,
            executedProposals: executedProposals.length,
            participationRate: userVotes.size > 0 ? (userVotes.size / (allProposals.length * 10)) * 100 : 0, // Assuming 10 users
            averageVotingTime: '3.2 days', // Mock data
            categories: ['infrastructure', 'finance', 'governance', 'community', 'education']
          }
        })

      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown action'
        }, { status: 400 })
    }
  } catch (error) {
    console.error('Governance GET API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}