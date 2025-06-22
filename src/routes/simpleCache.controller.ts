import type { Request, Response } from 'express';
import SimpleCache from '../services/SimpleCache.js';

/**
 * Clear all cache
 */
export const clearCache = (req: Request, res: Response) => {
  try {
    SimpleCache.clear();
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
export const getCacheStats = (req: Request, res: Response) => {
  try {
    const keys = SimpleCache.keys();
    
    res.status(200).json({
      success: true,
      data: {
        totalKeys: SimpleCache.size(),
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
export const deleteCacheKey = (req: Request, res: Response) => {
  try {
    const { key } = req.body;
    
    if (!key) {
      res.status(400).json({
        success: false,
        error: 'Cache key is required in request body'
      });
      return;
    }

    const deleted = SimpleCache.delete(key);
    
    if (deleted) {
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
