import { getAllMedicines, searchMedicineByName } from "./medicine.controller.js";
import type { Request, Response, NextFunction } from 'express';
import express from "express";


const router = express.Router();

// GET all medicines
router.get('/', getAllMedicines);

// GET medicine by ID
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        // TODO: Implement logic to fetch medicine by ID
        res.status(200).json({ message: `Get medicine with ID: ${id}` });
    } catch (error) {
        next(error);
    }
});

// POST create new medicine
router.post('/', searchMedicineByName);

export default router;