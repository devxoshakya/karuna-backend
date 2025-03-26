import express from 'express';
import { getAllDocs, getAllHospitals, searchDocsByName, searchHospitalsByName } from './data.controller';

const router = express.Router();

// Route to fetch all doctors
router.get('/docs', getAllDocs);

// Route to fetch all hospitals
router.get('/hospitals', getAllHospitals);

// Route to search doctors by name
router.post('/docs', searchDocsByName);

// Route to search hospitals by name
router.post('/hospitals', searchHospitalsByName);

export default router;
