import SimpleCache from './SimpleCache.js';
import ConnectDB from '../db/ConnectDB.js';

/**
 * Cache helper utility for Vercel-optimized database operations
 */
export class CacheHelper {
  /**
   * Get cached data or fetch from database with automatic caching
   * @param cacheKey - Unique cache key
   * @param fetchFunction - Function that returns the data from database
   * @param ttlMinutes - Time to live in minutes (0 = no expiration)
   */
  static async getOrFetch<T>(
    cacheKey: string,
    fetchFunction: () => Promise<T>,
    ttlMinutes: number = 0
  ): Promise<T> {
    // Check cache first
    const cached = SimpleCache.get<T>(cacheKey);
    if (cached !== null) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return cached;
    }

    console.log(`Cache miss for key: ${cacheKey}, fetching from database...`);
    
    // Connect to database and fetch data
    await ConnectDB(process.env.MONGODB_URI!);
    const data = await fetchFunction();
    
    // Cache the result
    SimpleCache.set(cacheKey, data);
    console.log(`Data cached for key: ${cacheKey}`);
    
    return data;
  }

  /**
   * Invalidate cache for specific key or pattern
   */
  static invalidate(keyOrPattern: string): boolean {
    if (keyOrPattern.includes('*')) {
      // Handle pattern matching
      const pattern = keyOrPattern.replace(/\*/g, '');
      const keys = SimpleCache.keys().filter(key => key.includes(pattern));
      keys.forEach(key => SimpleCache.delete(key));
      return keys.length > 0;
    } else {
      // Single key deletion
      return SimpleCache.delete(keyOrPattern);
    }
  }

  /**
   * Clear all cache
   */
  static clearAll(): void {
    SimpleCache.clear();
    console.log('All cache cleared');
  }

  /**
   * Get cache stats
   */
  static getStats() {
    return {
      totalKeys: SimpleCache.size(),
      keys: SimpleCache.keys()
    };
  }
}

export default CacheHelper;
