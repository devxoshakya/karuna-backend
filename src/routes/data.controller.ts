import CacheService from '../services/CacheService.js';
import Doc from '../models/Doc.js';
import Hospital from '../models/Hospital.js';
import type { Request, Response } from 'express';

// Fetch all doctors
export const getAllDocs = async (req: Request, res: Response) => {
try {
    await CacheService.ensureDBConnection();
    
    // Check cache first
    const cacheKey = 'all_docs';
    const cachedDocs = CacheService.get(cacheKey);
    
    if (cachedDocs) {
      console.log('Returning cached doctors data');
      return res.status(200).json(cachedDocs);
    }
    
    const docs = await Doc.find({});
    
    // Cache the result
    CacheService.set(cacheKey, docs);
    console.log('Doctors data cached');
    
    res.status(200).json(docs);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};


// Fetch doctors by specialization
export const getDocsBySpec = async (req: Request, res: Response) => {
  try {
    await CacheService.ensureDBConnection();
    const { specialization } = req.body;
    
    if (!specialization) {
      return res.status(400).json({ error: 'Specialization is required' });
    }
    
    // Create cache key based on specialization
    const cacheKey = `docs_by_spec_${JSON.stringify(specialization)}`;
    const cachedDocs = CacheService.get(cacheKey);
    
    if (cachedDocs) {
      console.log('Returning cached doctors by specialization data');
      return res.status(200).json(cachedDocs);
    }
    
    let docs;
    
    // Handle the case where specialization is a string
    if (typeof specialization === 'string') {
      // Split the string by "or" and trim each term
      const specializationTerms = specialization.split(/\s+or\s+/).map(term => term.trim());
      
      if (specializationTerms.some(term => term.toLowerCase() === 'general physician')) {
        // For General Physician, show all doctors with 'General practitioner' or 'Doctor' specialization
        docs = await Doc.find({ specialization: { $in: ['General practitioner', 'Doctor'] } });
      } else {
        // Search for docs matching any of the terms using $or
        docs = await Doc.find({
          $or: specializationTerms.map(term => ({
            specialization: { $regex: new RegExp(term, 'i') }
          }))
        });
      }
    } else {
      // If specialization is an array, search for docs matching any of the values
      docs = await Doc.find({ specialization: { $in: specialization } });
    }
    
    // Cache the result
    CacheService.set(cacheKey, docs);
    console.log('Doctors by specialization data cached');
    
    res.status(200).json(docs);
  } catch (error) {
    console.error('Error fetching doctors by specialization:', error);
    res.status(500).json({ error: 'Failed to fetch doctors by specialization' });
  }
};

// Fetch all hospitals
export const getAllHospitals = async (req: Request, res: Response) => {
  try {
    await CacheService.ensureDBConnection();
    
    // Check cache first
    const cacheKey = 'all_hospitals';
    const cachedHospitals = CacheService.get(cacheKey);
    
    if (cachedHospitals) {
      console.log('Returning cached hospitals data');
      return res.status(200).json(cachedHospitals);
    }
    
    const hospitals = await Hospital.find({});
    
    // Cache the result
    CacheService.set(cacheKey, hospitals);
    console.log('Hospitals data cached');
    
    res.status(200).json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
};

// Search doctors by name
export const searchDocsByName = async (req: Request, res: Response) => {
  try {
    await CacheService.ensureDBConnection();
    const { name } = req.body;
    
    // Create cache key based on search name
    const cacheKey = `search_docs_${name}`;
    const cachedDocs = CacheService.get(cacheKey);
    
    if (cachedDocs) {
      console.log('Returning cached doctors search data');
      return res.status(200).json(cachedDocs);
    }
    
    const docs = await Doc.find({ name: { $regex: name, $options: 'i' } });
    
    // Cache the result
    CacheService.set(cacheKey, docs);
    console.log('Doctors search data cached');
    
    res.status(200).json(docs);
  } catch (error) {
    console.error('Error searching doctors:', error);
    res.status(500).json({ error: 'Failed to search doctors' });
  }
};

// Search hospitals by name
export const searchHospitalsByName = async (req: Request, res: Response) => {
  try {
    await CacheService.ensureDBConnection();
    const { name } = req.body;
    
    // Create cache key based on search name
    const cacheKey = `search_hospitals_${name}`;
    const cachedHospitals = CacheService.get(cacheKey);
    
    if (cachedHospitals) {
      console.log('Returning cached hospitals search data');
      return res.status(200).json(cachedHospitals);
    }
    
    const hospitals = await Hospital.find({ name: { $regex: name, $options: 'i' } });
    
    // Cache the result
    CacheService.set(cacheKey, hospitals);
    console.log('Hospitals search data cached');
    
    res.status(200).json(hospitals);
  } catch (error) {
    console.error('Error searching hospitals:', error);
    res.status(500).json({ error: 'Failed to search hospitals' });
  }
};
