import express from 'express';
import { 
  clearCache, 
  getCacheStats, 
  deleteCacheKey, 
  resetDBConnection 
} from './cache.controller.js';

const router = express.Router();

// Clear all cache
router.delete('/clear', clearCache);

// Get cache statistics
router.get('/stats', getCacheStats);

// Delete specific cache key (using POST instead of DELETE with param)
router.post('/delete-key', deleteCacheKey);

// Reset database connection
router.post('/reset-db', resetDBConnection);

export default router;
