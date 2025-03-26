import ConnectDB from '../db/ConnectDB';
import Doc from '../models/Doc';
import Hospital from '../models/Hospital';
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
