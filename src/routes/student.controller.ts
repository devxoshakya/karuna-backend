import Student from '../models/Student.js'; // Adjust the import path as needed
import CacheService from '../services/CacheService.js';


export const getAllStudents = async (req: any, res: any, next: any) => {
    try {
        await CacheService.ensureDBConnection();
        
        // Check cache first
        const cacheKey = 'all_students';
        const cachedStudents = CacheService.get(cacheKey);
        
        if (cachedStudents) {
            console.log('Returning cached students data');
            return res.status(200).json(cachedStudents);
        }
        
        const students = await Student.find();
        
        const response = {
            success: true,
            count: students.length,
            data: students
        };
        
        // Cache the result
        CacheService.set(cacheKey, response);
        console.log('Students data cached');
        
        return res.status(200).json(response);
    } catch (error : any) {
        next(error);
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Export the controller function
export default {
    getAllStudents
};