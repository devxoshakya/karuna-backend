import  ConnectDB  from '../db/ConnectDB';
import  Drug  from '../models/Drug';

export const searchMedicineByName = async (req: any, res: any) => {
    try {
        // Get the prescription array from the request body
        const { prescription } = req.body;

        if (!prescription || !Array.isArray(prescription) || prescription.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: 'Valid prescription array is required' 
            });
        }

        // Connect to the database
        const db = await ConnectDB(process.env.MONGODB_URI!);
        
        // Array to store all found medicines
        const allFoundMedicines = [];
        
        // Search for each medicine in the prescription
        for (const medicineName of prescription) {
            const medicines = await Drug.find({ 
                genericName: { $regex: medicineName, $options: 'i' } 
            }).lean();
            
            if (medicines.length > 0) {
                // Sort medicines by name length and take the top 2 shortest names
                const sortedMedicines = medicines
                    .sort((a, b) => a.genericName.length - b.genericName.length)
                    .slice(0, 2);
                
                allFoundMedicines.push(...sortedMedicines);
            }
        }

        if (allFoundMedicines.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'No medicines found for the given prescription' 
            });
        }

        return res.status(200).json({
            success: true,
            count: allFoundMedicines.length,
            data: allFoundMedicines
        });

    } catch (error) {
        console.error('Error searching medicines from prescription:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

export const getAllMedicines = async (req: any, res: any) => {
    try {
        // Connect to the database
        const db = await ConnectDB(process.env.MONGODB_URI!);
        
        // Fetch all medicines from the database
        const medicines = await Drug.find().lean();

        if (medicines.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'No medicines found in the database' 
            });
        }

        return res.status(200).json({
            success: true,
            count: medicines.length,
            data: medicines
        });

    } catch (error) {
        console.error('Error fetching all medicines:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};