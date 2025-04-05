import ConnectDB from '../db/ConnectDB.js';
import Doc from '../models/Doc.js';
import Hospital from '../models/Hospital.js';
import type { Request, Response } from 'express';

// Fetch all doctors
export const getAllDocs = async (req: Request, res: Response) => {
try {
    await ConnectDB(process.env.MONGODB_URI!);
    const docs = await Doc.find({});
    res.status(200).json(docs);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: 'Failed to fetch doctors' });
  }
};


// Fetch doctors by specialization
export const getDocsBySpec = async (req: Request, res: Response) => {
  try {
    await ConnectDB(process.env.MONGODB_URI!);
    const { specialization } = req.body;
    
    if (!specialization) {
      return res.status(400).json({ error: 'Specialization is required' });
    }
    
    // Handle the case where specialization is a string
    if (typeof specialization === 'string') {
      // Split the string by "or" and trim each term
      const specializationTerms = specialization.split(/\s+or\s+/).map(term => term.trim());
      
      if (specializationTerms.some(term => term.toLowerCase() === 'general physician')) {
        // For General Physician, show all doctors with 'General practitioner' or 'Doctor' specialization
        const docs = await Doc.find({ specialization: { $in: ['General practitioner', 'Doctor'] } });
        return res.status(200).json(docs);
      }
      
      // Search for docs matching any of the terms using $or
      const docs = await Doc.find({
        $or: specializationTerms.map(term => ({
          specialization: { $regex: new RegExp(term, 'i') }
        }))
      });
      
      return res.status(200).json(docs);
    }
    
    // If specialization is an array, search for docs matching any of the values
    const docs = await Doc.find({ specialization: { $in: specialization } });
    res.status(200).json(docs);
  } catch (error) {
    console.error('Error fetching doctors by specialization:', error);
    res.status(500).json({ error: 'Failed to fetch doctors by specialization' });
  }
};

// Fetch all hospitals
export const getAllHospitals = async (req: Request, res: Response) => {
  try {
    await ConnectDB(process.env.MONGODB_URI!);
    const hospitals = await Hospital.find({});
    res.status(200).json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({ error: 'Failed to fetch hospitals' });
  }
};

// Search doctors by name
export const searchDocsByName = async (req: Request, res: Response) => {
  try {
    await ConnectDB(process.env.MONGODB_URI!);
    const { name } = req.body;
    const docs = await Doc.find({ name: { $regex: name, $options: 'i' } });
    res.status(200).json(docs);
  } catch (error) {
    console.error('Error searching doctors:', error);
    res.status(500).json({ error: 'Failed to search doctors' });
  }
};

// Search hospitals by name
export const searchHospitalsByName = async (req: Request, res: Response) => {
  try {
    await ConnectDB(process.env.MONGODB_URI!);
    const { name } = req.body;
    const hospitals = await Hospital.find({ name: { $regex: name, $options: 'i' } });
    res.status(200).json(hospitals);
  } catch (error) {
    console.error('Error searching hospitals:', error);
    res.status(500).json({ error: 'Failed to search hospitals' });
  }
};
