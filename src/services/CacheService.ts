import NodeCache from 'node-cache';
import mongoose from 'mongoose';
import ConnectDB from '../db/ConnectDB.js';

class CacheService {
  private cache: NodeCache;
  private isConnected: boolean = false;

  constructor() {
    // Initialize cache with no TTL (cache until manually cleared)
    this.cache = new NodeCache({ 
      stdTTL: 0, // 0 means no automatic expiration
      checkperiod: 0 // Disable automatic cleanup
    });
  }

  /**
   * Get cached data by key
   */
  get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  /**
   * Set data in cache
   */
  set<T>(key: string, value: T): boolean {
    return this.cache.set(key, value);
  }

  /**
   * Delete specific key from cache
   */
  delete(key: string): number {
    return this.cache.del(key);
  }

  /**
   * Clear all cache
   */
  clearAll(): void {
    this.cache.flushAll();
    console.log('Cache cleared successfully');
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return this.cache.getStats();
  }

  /**
   * Get all cache keys
   */
  getKeys(): string[] {
    return this.cache.keys();
  }

  /**
   * Ensure database connection with caching
   */
  async ensureDBConnection(): Promise<void> {
    if (this.isConnected && mongoose.connection.readyState === 1) {
      return;
    }

    try {
      await ConnectDB(process.env.MONGODB_URI!);
      this.isConnected = true;
      console.log('Database connection established and cached');
    } catch (error) {
      this.isConnected = false;
      console.error('Failed to establish database connection:', error);
      throw error;
    }
  }

  /**
   * Reset database connection
   */
  async resetDBConnection(): Promise<void> {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      this.isConnected = false;
      await this.ensureDBConnection();
    } catch (error) {
      console.error('Failed to reset database connection:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new CacheService();
