/**
 * Unified Web3 Integrations Index
 * 
 * This file exports all the Web3 technology integrations for the RealFi Community Trust Hub.
 * Each integration provides specific functionality for decentralized finance, identity, and privacy.
 */

// Human Protocol - Identity Verification & Human-Only Validation
import { humanProtocol, HumanProtocolSDK } from './human-protocol';
export { HumanProtocolSDK } from './human-protocol';
export type { HumanPassport, HumanVerificationResult } from './human-protocol';

// Nillion - Private Data Storage & Computation
import { nillion, NillionSDK } from './nillion';
export { NillionSDK } from './nillion';
export type { NillionStorage, NillionComputeResult, NillionSecretShare } from './nillion';

// EdgeCity - Decentralized Infrastructure & Edge Computing
import { edgeCity, EdgeCitySDK } from './edgecity';
export { EdgeCitySDK } from './edgecity';
export type { EdgeCityNode, EdgeDeployment, EdgeFunction } from './edgecity';

// Logos - Decentralized Identity & Naming
import { logos, LogosSDK } from './logos';
export { LogosSDK } from './logos';
export type { LogosIdentity, LogosName, LogosEndorsement, LogosVerification } from './logos';

// Numbers Protocol - Digital Asset Verification & Provenance
import { numbersProtocol, NumbersSDK } from './numbers-protocol';
export { NumbersSDK } from './numbers-protocol';
export type { NumbersAsset, NumbersCertificate, NumbersVerification, NumbersProvenanceRecord } from './numbers-protocol';

// GoodDollar - UBI & Stablecoin Services
import { goodDollar, GoodDollarSDK } from './gooddollar';
export { GoodDollarSDK } from './gooddollar';
export type { GoodDollarAccount, UBIClaim, GoodDollarTransaction, SavingsAccount } from './gooddollar';

// Internet Archive - Decentralized Data Preservation
import { internetArchive, InternetArchiveSDK } from './internet-archive';
export { InternetArchiveSDK } from './internet-archive';
export type { ArchiveItem, ArchivePreservation, ArchiveSnapshot } from './internet-archive';

// Tor Project - Privacy & Anonymity
import { torProject, TorSDK } from './tor';
export { TorSDK } from './tor';
export type { TorConnection, TorHiddenService, TorPrivacyMetrics, TorCircuit } from './tor';

// Bento - Professional Profile & Identity Management
import { bento, BentoSDK } from './bento';
export { BentoSDK } from './bento';
export type { BentoProfile, BentoVerification, BentoEndorsement, BentoAnalytics } from './bento';

/**
 * Integration Manager - Coordinates all Web3 integrations
 */
export class IntegrationManager {
  private static instance: IntegrationManager;
  private initialized = false;

  private constructor() {}

  static getInstance(): IntegrationManager {
    if (!IntegrationManager.instance) {
      IntegrationManager.instance = new IntegrationManager();
    }
    return IntegrationManager.instance;
  }

  /**
   * Initialize all integrations
   */
  async initializeAll(): Promise<void> {
    if (this.initialized) return;

    try {
      console.log('🚀 Initializing Web3 Integrations...');
      
      // Initialize each integration
      await this.initializeHumanProtocol();
      await this.initializeNillion();
      await this.initializeEdgeCity();
      await this.initializeLogos();
      await this.initializeNumbersProtocol();
      await this.initializeGoodDollar();
      await this.initializeInternetArchive();
      await this.initializeTorProject();
      await this.initializeBento();

      this.initialized = true;
      console.log('✅ All Web3 Integrations initialized successfully!');
    } catch (error) {
      console.error('❌ Failed to initialize integrations:', error);
      throw error;
    }
  }

  /**
   * Get status of all integrations
   */
  async getAllStatus(): Promise<Record<string, {
    connected: boolean;
    features: string[];
    lastChecked: string;
  }>> {
    const status: Record<string, any> = {};

    status.humanProtocol = {
      connected: await this.checkHumanProtocolStatus(),
      features: ['Identity Verification', 'Sybil Resistance', 'Reputation System'],
      lastChecked: new Date().toISOString()
    };

    status.nillion = {
      connected: await this.checkNillionStatus(),
      features: ['Private Storage', 'Secure Computation', 'Secret Sharing'],
      lastChecked: new Date().toISOString()
    };

    status.edgeCity = {
      connected: await this.checkEdgeCityStatus(),
      features: ['Edge Computing', 'Global CDN', 'Serverless Functions'],
      lastChecked: new Date().toISOString()
    };

    status.logos = {
      connected: await this.checkLogosStatus(),
      features: ['Decentralized Names', 'Identity Management', 'Reputation'],
      lastChecked: new Date().toISOString()
    };

    status.numbersProtocol = {
      connected: await this.checkNumbersProtocolStatus(),
      features: ['Asset Verification', 'Provenance Tracking', 'Certificates'],
      lastChecked: new Date().toISOString()
    };

    status.goodDollar = {
      connected: await this.checkGoodDollarStatus(),
      features: ['UBI Distribution', 'Stablecoin', 'Savings Accounts'],
      lastChecked: new Date().toISOString()
    };

    status.internetArchive = {
      connected: await this.checkInternetArchiveStatus(),
      features: ['Data Preservation', 'Web Archiving', 'Permanent Storage'],
      lastChecked: new Date().toISOString()
    };

    status.torProject = {
      connected: await this.checkTorProjectStatus(),
      features: ['Anonymous Browsing', 'Hidden Services', 'Privacy Protection'],
      lastChecked: new Date().toISOString()
    };

    status.bento = {
      connected: await this.checkBentoStatus(),
      features: ['Professional Profiles', 'Credential Verification', 'Networking'],
      lastChecked: new Date().toISOString()
    };

    return status;
  }

  /**
   * Get unified dashboard data
   */
  async getDashboardData(): Promise<{
    identity: any;
    finance: any;
    privacy: any;
    infrastructure: any;
    reputation: any;
  }> {
    const [
      humanStats,
      goodDollarStats,
      nillionStats,
      torStats,
      edgeCityStats,
      logosStats,
      bentoStats
    ] = await Promise.all([
      humanProtocol.getVerificationStats(),
      goodDollar.getUBIStats(),
      nillion.getNetworkStats(),
      torProject.getNetworkStats(),
      edgeCity.getNetworkMetrics(),
      logos.getNetworkStats(),
      bento.getNetworkStats()
    ]);

    return {
      identity: {
        humanProtocol: humanStats,
        logos: logosStats,
        bento: bentoStats
      },
      finance: {
        goodDollar: goodDollarStats
      },
      privacy: {
        nillion: nillionStats,
        tor: torStats
      },
      infrastructure: {
        edgeCity: edgeCityStats,
        internetArchive: await internetArchive.getNetworkStats()
      },
      reputation: {
        numbersProtocol: await numbersProtocol.getNetworkStats()
      }
    };
  }

  // Private initialization methods
  private async initializeHumanProtocol(): Promise<void> {
    console.log('🔐 Initializing Human Protocol...');
    // Human Protocol is ready to use
  }

  private async initializeNillion(): Promise<void> {
    console.log('🛡️ Initializing Nillion...');
    // Nillion is ready to use
  }

  private async initializeEdgeCity(): Promise<void> {
    console.log('🌐 Initializing EdgeCity...');
    // EdgeCity is ready to use
  }

  private async initializeLogos(): Promise<void> {
    console.log('📝 Initializing Logos...');
    // Logos is ready to use
  }

  private async initializeNumbersProtocol(): Promise<void> {
    console.log('🔢 Initializing Numbers Protocol...');
    // Numbers Protocol is ready to use
  }

  private async initializeGoodDollar(): Promise<void> {
    console.log('💰 Initializing GoodDollar...');
    // GoodDollar is ready to use
  }

  private async initializeInternetArchive(): Promise<void> {
    console.log('📚 Initializing Internet Archive...');
    // Internet Archive is ready to use
  }

  private async initializeTorProject(): Promise<void> {
    console.log('🕵️ Initializing Tor Project...');
    // Tor Project is ready to use
  }

  private async initializeBento(): Promise<void> {
    console.log('👤 Initializing Bento...');
    // Bento is ready to use
  }

  // Private status check methods
  private async checkHumanProtocolStatus(): Promise<boolean> {
    try {
      await humanProtocol.getVerificationStats();
      return true;
    } catch {
      return false;
    }
  }

  private async checkNillionStatus(): Promise<boolean> {
    try {
      await nillion.getNetworkStats();
      return true;
    } catch {
      return false;
    }
  }

  private async checkEdgeCityStatus(): Promise<boolean> {
    try {
      await edgeCity.getNetworkMetrics();
      return true;
    } catch {
      return false;
    }
  }

  private async checkLogosStatus(): Promise<boolean> {
    try {
      await logos.getNetworkStats();
      return true;
    } catch {
      return false;
    }
  }

  private async checkNumbersProtocolStatus(): Promise<boolean> {
    try {
      await numbersProtocol.getNetworkStats();
      return true;
    } catch {
      return false;
    }
  }

  private async checkGoodDollarStatus(): Promise<boolean> {
    try {
      await goodDollar.getUBIStats();
      return true;
    } catch {
      return false;
    }
  }

  private async checkInternetArchiveStatus(): Promise<boolean> {
    try {
      await internetArchive.getNetworkStats();
      return true;
    } catch {
      return false;
    }
  }

  private async checkTorProjectStatus(): Promise<boolean> {
    try {
      await torProject.getNetworkStats();
      return true;
    } catch {
      return false;
    }
  }

  private async checkBentoStatus(): Promise<boolean> {
    try {
      await bento.getNetworkStats();
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const integrationManager = IntegrationManager.getInstance();

// Export all integrations for easy access
export const integrations = {
  humanProtocol,
  nillion,
  edgeCity,
  logos,
  numbersProtocol,
  goodDollar,
  internetArchive,
  torProject,
  bento
};