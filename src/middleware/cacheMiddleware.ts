import type { Request, Response, NextFunction } from 'express';
import CacheService from '../services/CacheService.js';

/**
 * Middleware to ensure database connection is established
 */
export const ensureDBConnection = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await CacheService.ensureDBConnection();
    next();
  } catch (error) {
    console.error('Database connection middleware error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
};

/**
 * Middleware to cache GET requests based on URL and query parameters
 */
export const cacheMiddleware = (cacheDurationMinutes: number = 0) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Create cache key from URL and query parameters
    const cacheKey = `${req.originalUrl || req.url}_${JSON.stringify(req.query)}`;
    
    // Check if data exists in cache
    const cachedData = CacheService.get(cacheKey);
    
    if (cachedData) {
      console.log(`Cache hit for key: ${cacheKey}`);
      return res.json(cachedData);
    }

    // Store original json method
    const originalJson = res.json;

    // Override json method to cache the response
    res.json = function(data: any) {
      // Cache the response if it's a successful request
      if (res.statusCode >= 200 && res.statusCode < 300) {
        CacheService.set(cacheKey, data);
        console.log(`Data cached for key: ${cacheKey}`);
      }
      
      // Call original json method
      return originalJson.call(this, data);
    };

    next();
  };
};

/**
 * Middleware to cache POST/PUT requests based on request body
 */
export const cachePostMiddleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Create cache key from URL and request body
    const cacheKey = `${req.originalUrl || req.url}_${JSON.stringify(req.body)}`;
    
    // Check if data exists in cache
    const cachedData = CacheService.get(cacheKey);
    
    if (cachedData) {
      console.log(`Cache hit for POST key: ${cacheKey}`);
      return res.json(cachedData);
    }

    // Store original json method
    const originalJson = res.json;

    // Override json method to cache the response
    res.json = function(data: any) {
      // Cache the response if it's a successful request
      if (res.statusCode >= 200 && res.statusCode < 300) {
        CacheService.set(cacheKey, data);
        console.log(`Data cached for POST key: ${cacheKey}`);
      }
      
      // Call original json method
      return originalJson.call(this, data);
    };

    next();
  };
};
