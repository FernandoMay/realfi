/**
 * Bento Integration SDK
 * https://bento.me/crecimientoar
 * 
 * Bento provides professional profile and identity management for Web3,
 * enabling unified digital presence and credential verification.
 */

import CryptoJS from 'crypto-js';

export interface BentoProfile {
  id: string;
  username: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  banner?: string;
  links: Array<{
    id: string;
    platform: string;
    url: string;
    title: string;
    verified: boolean;
  }>;
  skills: Array<{
    name: string;
    level: number; // 1-5
    endorsements: number;
    verified: boolean;
  }>;
  experiences: Array<{
    id: string;
    title: string;
    organization: string;
    startDate: string;
    endDate?: string;
    description?: string;
    verified: boolean;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    verified: boolean;
  }>;
  credentials: Array<{
    id: string;
    type: 'certificate' | 'degree' | 'license' | 'badge';
    title: string;
    issuer: string;
    issuedDate: string;
    expiresAt?: string;
    verificationUrl?: string;
    verified: boolean;
  }>;
  socials: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    website?: string;
    discord?: string;
    telegram?: string;
  };
  blockchain: {
    addresses: Array<{
      chain: string;
      address: string;
      verified: boolean;
    }>;
    ens?: string;
    lens?: string;
    farcaster?: string;
  };
  reputation: {
    score: number;
    level: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
    endorsements: number;
    verifications: number;
    contributions: number;
  };
  privacy: {
    profileVisibility: 'public' | 'connections' | 'private';
    contactVisibility: boolean;
    showWalletBalance: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BentoVerification {
  id: string;
  profileId: string;
  type: 'identity' | 'skill' | 'experience' | 'education' | 'credential' | 'wallet';
  method: 'document' | 'blockchain' | 'api' | 'manual';
  status: 'pending' | 'in_review' | 'verified' | 'rejected';
  data: Record<string, any>;
  evidence?: string[];
  verifiedBy?: string;
  verifiedAt?: string;
  expiresAt?: string;
}

export interface BentoEndorsement {
  id: string;
  endorserId: string;
  endorserName: string;
  recipientId: string;
  type: 'skill' | 'experience' | 'general';
  target: string; // skill name or experience ID
  comment?: string;
  weight: number; // 1-5
  timestamp: string;
  verified: boolean;
  revocable: boolean;
}

export interface BentoAnalytics {
  profileViews: number;
  linkClicks: Array<{
    linkId: string;
    clicks: number;
    lastClicked: string;
  }>;
  networkGrowth: {
    connections: number;
    followers: number;
    following: number;
  };
  engagement: {
    endorsements: number;
    recommendations: number;
    messages: number;
  };
  trends: Array<{
    date: string;
    views: number;
    clicks: number;
  }>;
}

export class BentoSDK {
  private apiKey: string;
  private baseUrl: string;
  private cache: Map<string, any>;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.bento.me/v1';
    this.cache = new Map();
  }

  /**
   * Create or update Bento profile
   */
  async createProfile(profileData: {
    username: string;
    displayName: string;
    bio?: string;
    walletAddress: string;
  }): Promise<BentoProfile> {
    try {
      const profileId = `profile_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      const profile: BentoProfile = {
        id: profileId,
        username: profileData.username,
        displayName: profileData.displayName,
        bio: profileData.bio,
        links: [],
        skills: [],
        experiences: [],
        education: [],
        credentials: [],
        socials: {},
        blockchain: {
          addresses: [{
            chain: 'ethereum',
            address: profileData.walletAddress,
            verified: false
          }]
        },
        reputation: {
          score: 0,
          level: 'bronze',
          endorsements: 0,
          verifications: 0,
          contributions: 0
        },
        privacy: {
          profileVisibility: 'public',
          contactVisibility: true,
          showWalletBalance: false
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await this.mockBentoCall('/profiles/create', {
        profileId,
        ...profileData
      });

      this.cache.set(`profile_${profileData.username}`, profile);
      return profile;
    } catch (error) {
      console.error('Profile creation failed:', error);
      throw new Error('Profile creation failed');
    }
  }

  /**
   * Get profile by username or ID
   */
  async getProfile(identifier: string): Promise<BentoProfile | null> {
    try {
      // Check cache first
      const cached = this.cache.get(`profile_${identifier}`);
      if (cached) {
        return cached;
      }

      const response = await this.mockBentoCall('/profiles/get', { identifier });
      
      if (!response.exists) {
        return null;
      }

      const profile: BentoProfile = {
        id: response.id || `profile_${identifier}`,
        username: response.username || identifier,
        displayName: response.displayName || 'Unknown',
        bio: response.bio,
        links: response.links || [],
        skills: response.skills || [],
        experiences: response.experiences || [],
        education: response.education || [],
        credentials: response.credentials || [],
        socials: response.socials || {},
        blockchain: response.blockchain || {
          addresses: [],
          ens: undefined,
          lens: undefined,
          farcaster: undefined
        },
        reputation: response.reputation || {
          score: Math.floor(Math.random() * 1000),
          level: this.getReputationLevel(Math.floor(Math.random() * 1000)),
          endorsements: Math.floor(Math.random() * 50),
          verifications: Math.floor(Math.random() * 20),
          contributions: Math.floor(Math.random() * 100)
        },
        privacy: response.privacy || {
          profileVisibility: 'public',
          contactVisibility: true,
          showWalletBalance: false
        },
        createdAt: response.createdAt || new Date().toISOString(),
        updatedAt: response.updatedAt || new Date().toISOString()
      };

      this.cache.set(`profile_${identifier}`, profile);
      return profile;
    } catch (error) {
      console.error('Failed to get profile:', error);
      return null;
    }
  }

  /**
   * Update profile information
   */
  async updateProfile(
    profileId: string,
    updates: Partial<BentoProfile>
  ): Promise<BentoProfile> {
    try {
      const currentProfile = await this.getProfile(profileId);
      if (!currentProfile) {
        throw new Error('Profile not found');
      }

      const updatedProfile = {
        ...currentProfile,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      await this.mockBentoCall('/profiles/update', {
        profileId,
        updates
      });

      this.cache.set(`profile_${profileId}`, updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Profile update failed:', error);
      throw new Error('Profile update failed');
    }
  }

  /**
   * Add verification request
   */
  async addVerification(
    profileId: string,
    type: 'identity' | 'skill' | 'experience' | 'education' | 'credential' | 'wallet',
    method: 'document' | 'blockchain' | 'api' | 'manual',
    data: Record<string, any>
  ): Promise<BentoVerification> {
    try {
      const verificationId = `ver_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      const verification: BentoVerification = {
        id: verificationId,
        profileId,
        type,
        method,
        status: 'pending',
        data,
        verifiedAt: undefined,
        expiresAt: type === 'credential' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() : undefined
      };

      await this.mockBentoCall('/verifications/create', {
        verificationId,
        profileId,
        type,
        method,
        data
      });

      // Simulate verification process
      setTimeout(() => {
        verification.status = 'verified';
        verification.verifiedAt = new Date().toISOString();
      }, 3000);

      return verification;
    } catch (error) {
      console.error('Verification creation failed:', error);
      throw new Error('Verification creation failed');
    }
  }

  /**
   * Add endorsement to profile
   */
  async addEndorsement(
    endorserId: string,
    recipientId: string,
    type: 'skill' | 'experience' | 'general',
    target: string,
    weight: number = 3,
    comment?: string
  ): Promise<BentoEndorsement> {
    try {
      const endorsementId = `endorse_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      const endorsement: BentoEndorsement = {
        id: endorsementId,
        endorserId,
        endorserName: `User_${endorserId.slice(0, 8)}`,
        recipientId,
        type,
        target,
        weight,
        comment,
        timestamp: new Date().toISOString(),
        verified: false,
        revocable: true
      };

      await this.mockBentoCall('/endorsements/create', {
        endorsementId,
        endorserId,
        recipientId,
        type,
        target,
        weight,
        comment
      });

      return endorsement;
    } catch (error) {
      console.error('Endorsement creation failed:', error);
      throw new Error('Endorsement creation failed');
    }
  }

  /**
   * Get profile analytics
   */
  async getAnalytics(profileId: string): Promise<BentoAnalytics> {
    try {
      const response = await this.mockBentoCall('/analytics/get', { profileId });
      
      return {
        profileViews: response.profileViews || Math.floor(Math.random() * 10000),
        linkClicks: response.linkClicks || [
          {
            linkId: 'link_1',
            clicks: Math.floor(Math.random() * 1000),
            lastClicked: new Date().toISOString()
          }
        ],
        networkGrowth: {
          connections: response.connections || Math.floor(Math.random() * 500),
          followers: response.followers || Math.floor(Math.random() * 1000),
          following: response.following || Math.floor(Math.random() * 200)
        },
        engagement: {
          endorsements: response.endorsements || Math.floor(Math.random() * 50),
          recommendations: response.recommendations || Math.floor(Math.random() * 20),
          messages: response.messages || Math.floor(Math.random() * 100)
        },
        trends: response.trends || this.generateMockTrends()
      };
    } catch (error) {
      console.error('Failed to get analytics:', error);
      return {
        profileViews: 0,
        linkClicks: [],
        networkGrowth: { connections: 0, followers: 0, following: 0 },
        engagement: { endorsements: 0, recommendations: 0, messages: 0 },
        trends: []
      };
    }
  }

  /**
   * Search profiles
   */
  async searchProfiles(query: string, filters?: {
    skills?: string[];
    location?: string;
    reputation?: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
    verified?: boolean;
    limit?: number;
  }): Promise<BentoProfile[]> {
    try {
      const response = await this.mockBentoCall('/profiles/search', {
        query,
        filters
      });

      return response.profiles || this.generateMockProfiles(query, filters?.limit || 10);
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  }

  /**
   * Connect profiles (networking)
   */
  async connectProfiles(profileId1: string, profileId2: string): Promise<boolean> {
    try {
      await this.mockBentoCall('/profiles/connect', {
        profileId1,
        profileId2
      });

      return true;
    } catch (error) {
      console.error('Connection failed:', error);
      return false;
    }
  }

  /**
   * Get network statistics
   */
  async getNetworkStats(): Promise<{
    totalProfiles: number;
    activeProfiles: number;
    totalConnections: number;
    averageReputation: number;
    topSkills: Array<{ skill: string; count: number }>;
    countries: string[];
  }> {
    try {
      const response = await this.mockBentoCall('/network/stats', {});
      
      return {
        totalProfiles: response.totalProfiles || 2500000,
        activeProfiles: response.activeProfiles || 1875000,
        totalConnections: response.totalConnections || 12500000,
        averageReputation: response.averageReputation || 625,
        topSkills: response.topSkills || [
          { skill: 'Web3 Development', count: 45000 },
          { skill: 'Smart Contracts', count: 38000 },
          { skill: 'DeFi', count: 32000 },
          { skill: 'UI/UX Design', count: 28000 },
          { skill: 'Community Management', count: 22000 }
        ],
        countries: response.countries || ['US', 'UK', 'Germany', 'Canada', 'Australia', 'Singapore']
      };
    } catch (error) {
      return {
        totalProfiles: 2500000,
        activeProfiles: 1875000,
        totalConnections: 12500000,
        averageReputation: 625,
        topSkills: [
          { skill: 'Web3 Development', count: 45000 },
          { skill: 'Smart Contracts', count: 38000 },
          { skill: 'DeFi', count: 32000 }
        ],
        countries: ['US', 'UK', 'Germany', 'Canada', 'Australia']
      };
    }
  }

  /**
   * Get reputation level based on score
   */
  private getReputationLevel(score: number): 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' {
    if (score >= 1600) return 'diamond';
    if (score >= 1200) return 'platinum';
    if (score >= 800) return 'gold';
    if (score >= 400) return 'silver';
    return 'bronze';
  }

  /**
   * Generate mock trends
   */
  private generateMockTrends(): Array<{ date: string; views: number; clicks: number }> {
    const trends: Array<{ date: string; views: number; clicks: number }> = [];
    const now = Date.now();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      trends.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 500) + 50,
        clicks: Math.floor(Math.random() * 100) + 10
      });
    }
    
    return trends;
  }

  /**
   * Generate mock profiles
   */
  private generateMockProfiles(query: string, limit: number): BentoProfile[] {
    const skills = ['Web3 Development', 'Smart Contracts', 'DeFi', 'UI/UX Design', 'Community Management'];
    
    return Array.from({ length: limit }, (_, i) => {
      const score = Math.floor(Math.random() * 2000);
      return {
        id: `profile_${i}_${Date.now()}`,
        username: `${query || 'user'}${i}`,
        displayName: `${query || 'User'} ${i + 1}`,
        bio: `Professional ${i + 1} with expertise in Web3`,
        links: [],
        skills: skills.slice(0, Math.floor(Math.random() * 3) + 1).map(skill => ({
          name: skill,
          level: Math.floor(Math.random() * 5) + 1,
          endorsements: Math.floor(Math.random() * 20),
          verified: Math.random() > 0.5
        })),
        experiences: [],
        education: [],
        credentials: [],
        socials: {
          twitter: `@user${i}`,
          github: `user${i}`,
          linkedin: `user${i}`
        },
        blockchain: {
          addresses: [{
            chain: 'ethereum',
            address: `0x${Math.random().toString(16).substr(2, 40)}`,
            verified: Math.random() > 0.5
          }]
        },
        reputation: {
          score,
          level: this.getReputationLevel(score),
          endorsements: Math.floor(Math.random() * 50),
          verifications: Math.floor(Math.random() * 10),
          contributions: Math.floor(Math.random() * 100)
        },
        privacy: {
          profileVisibility: 'public',
          contactVisibility: true,
          showWalletBalance: false
        },
        createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      };
    });
  }

  /**
   * Mock Bento API call
   */
  private async mockBentoCall(endpoint: string, data: any): Promise<any> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    if (endpoint.includes('/profiles/create')) {
      return { success: true, profileId: data.profileId };
    }
    
    if (endpoint.includes('/profiles/get')) {
      return Math.random() > 0.1 ? {
        exists: true,
        id: `profile_${data.identifier}`,
        username: data.identifier,
        displayName: 'Sample User',
        verified: true
      } : { exists: false };
    }
    
    if (endpoint.includes('/profiles/update')) {
      return { success: true };
    }
    
    if (endpoint.includes('/verifications/create')) {
      return { success: true, verificationId: data.verificationId };
    }
    
    if (endpoint.includes('/endorsements/create')) {
      return { success: true, endorsementId: data.endorsementId };
    }
    
    if (endpoint.includes('/profiles/connect')) {
      return { success: true };
    }
    
    if (endpoint.includes('/network/stats')) {
      return {
        totalProfiles: 2500000,
        activeProfiles: 1875000,
        totalConnections: 12500000,
        averageReputation: 625,
        topSkills: [
          { skill: 'Web3 Development', count: 45000 },
          { skill: 'Smart Contracts', count: 38000 },
          { skill: 'DeFi', count: 32000 }
        ],
        countries: ['US', 'UK', 'Germany', 'Canada', 'Australia']
      };
    }
    
    return { success: true };
  }
}

// Create singleton instance
export const bento = new BentoSDK(process.env.NEXT_PUBLIC_BENTO_API_KEY || 'demo_key');