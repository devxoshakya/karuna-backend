import express from 'express';
import { 
  clearCache, 
  getCacheStats, 
  deleteCacheKey 
} from './simpleCache.controller.js';

const router = express.Router();

// Clear all cache
router.delete('/clear', clearCache);

// Get cache statistics
router.get('/stats', getCacheStats);

// Delete specific cache key
router.post('/delete-key', deleteCacheKey);

export default router;
