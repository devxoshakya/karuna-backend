import type { Request, Response } from 'express';
import CacheService from '../services/CacheService.js';

/**
 * Clear all cache
 */
export const clearCache = async (req: Request, res: Response) => {
  try {
    CacheService.clearAll();
    res.status(200).json({ 
      success: true, 
      message: 'Cache cleared successfully' 
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to clear cache' 
    });
  }
};

/**
 * Get cache statistics
 */
export const getCacheStats = async (req: Request, res: Response) => {
  try {
    const stats = CacheService.getStats();
    const keys = CacheService.getKeys();
    
    res.status(200).json({
      success: true,
      data: {
        stats,
        totalKeys: keys.length,
        keys: keys
      }
    });
  } catch (error) {
    console.error('Error getting cache stats:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get cache statistics' 
    });
  }
};

/**
 * Delete specific cache key
 */
export const deleteCacheKey = async (req: Request, res: Response) => {
  try {
    const { key } = req.body;
    
    if (!key) {
      return res.status(400).json({
        success: false,
        error: 'Cache key is required in request body'
      });
    }

    const deleted = CacheService.delete(key);
    
    if (deleted > 0) {
      res.status(200).json({
        success: true,
        message: `Cache key '${key}' deleted successfully`
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Cache key '${key}' not found`
      });
    }
  } catch (error) {
    console.error('Error deleting cache key:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete cache key' 
    });
  }
};

/**
 * Reset database connection
 */
export const resetDBConnection = async (req: Request, res: Response) => {
  try {
    await CacheService.resetDBConnection();
    res.status(200).json({
      success: true,
      message: 'Database connection reset successfully'
    });
  } catch (error) {
    console.error('Error resetting database connection:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to reset database connection' 
    });
  }
};
