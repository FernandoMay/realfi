'use client'

// Enhanced localStorage wrapper with error handling and type safety
export class SecureStorage {
  private prefix: string

  constructor(prefix = 'realfi_') {
    this.prefix = prefix
  }

  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  set<T>(key: string, value: T): boolean {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(this.getKey(key), serializedValue)
      return true
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
      return false
    }
  }

  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(this.getKey(key))
      if (item === null) {
        return defaultValue || null
      }
      return JSON.parse(item) as T
    } catch (error) {
      console.error('Failed to read from localStorage:', error)
      return defaultValue || null
    }
  }

  remove(key: string): boolean {
    try {
      localStorage.removeItem(this.getKey(key))
      return true
    } catch (error) {
      console.error('Failed to remove from localStorage:', error)
      return false
    }
  }

  clear(): boolean {
    try {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(this.prefix)
      )
      keys.forEach(key => localStorage.removeItem(key))
      return true
    } catch (error) {
      console.error('Failed to clear localStorage:', error)
      return false
    }
  }

  exists(key: string): boolean {
    return localStorage.getItem(this.getKey(key)) !== null
  }

  // Session storage wrapper
  setSession<T>(key: string, value: T): boolean {
    try {
      const serializedValue = JSON.stringify(value)
      sessionStorage.setItem(this.getKey(key), serializedValue)
      return true
    } catch (error) {
      console.error('Failed to save to sessionStorage:', error)
      return false
    }
  }

  getSession<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = sessionStorage.getItem(this.getKey(key))
      if (item === null) {
        return defaultValue || null
      }
      return JSON.parse(item) as T
    } catch (error) {
      console.error('Failed to read from sessionStorage:', error)
      return defaultValue || null
    }
  }
}

// Create singleton instance
export const storage = new SecureStorage()

// Types for stored data
export interface StoredUser {
  id: string
  name: string
  email: string
  verificationLevel: 'basic' | 'verified' | 'premium'
  joinDate: string
  preferences: UserPreferences
}

export interface UserPreferences {
  notifications: boolean
  privacy: 'basic' | 'enhanced' | 'maximum'
  theme: 'light' | 'dark' | 'system'
  language: string
  currency: string
}

export interface StoredWallet {
  address: string
  network: string
  connectedAt: string
  features: string[]
}

export interface StoredTransactions {
  transactions: Array<{
    id: string
    type: string
    amount: number
    currency: string
    timestamp: string
    status: string
  }>
}

export interface StoredIdentity {
  passportId?: string
  verifiedAt?: string
  uniquenessScore?: number
  sybilResistance?: boolean
  storageId?: string
  did?: string
}

// Storage keys
export const STORAGE_KEYS = {
  USER: 'user',
  WALLET: 'wallet',
  TRANSACTIONS: 'transactions',
  IDENTITY: 'identity',
  PREFERENCES: 'preferences',
  CACHE: 'cache'
} as const

// Cache management
export class CacheManager {
  private storage: SecureStorage
  private defaultTTL: number = 5 * 60 * 1000 // 5 minutes

  constructor(storage: SecureStorage) {
    this.storage = storage
  }

  set<T>(key: string, value: T, ttl: number = this.defaultTTL): void {
    const cacheItem = {
      value,
      timestamp: Date.now(),
      ttl
    }
    this.storage.set(`cache_${key}`, cacheItem)
  }

  get<T>(key: string): T | null {
    const cacheItem = this.storage.get(`cache_${key}`) as { value: T; timestamp: number; ttl: number } | null
    if (!cacheItem) return null

    const { value, timestamp, ttl } = cacheItem
    if (Date.now() - timestamp > ttl) {
      this.storage.remove(`cache_${key}`)
      return null
    }

    return value
  }

  clear(): void {
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith('realfi_cache_')
    )
    keys.forEach(key => localStorage.removeItem(key))
  }
}

export const cache = new CacheManager(storage)

// Utility functions
export const persistUserState = (user: StoredUser): void => {
  storage.set(STORAGE_KEYS.USER, user)
}

export const getUserState = (): StoredUser | null => {
  return storage.get<StoredUser>(STORAGE_KEYS.USER)
}

export const persistWalletState = (wallet: StoredWallet): void => {
  storage.set(STORAGE_KEYS.WALLET, wallet)
}

export const getWalletState = (): StoredWallet | null => {
  return storage.get<StoredWallet>(STORAGE_KEYS.WALLET)
}

export const persistIdentityState = (identity: StoredIdentity): void => {
  storage.set(STORAGE_KEYS.IDENTITY, identity)
}

export const getIdentityState = (): StoredIdentity | null => {
  return storage.get<StoredIdentity>(STORAGE_KEYS.IDENTITY)
}

export const clearAllData = (): void => {
  storage.clear()
  cache.clear()
}