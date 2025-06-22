import Student from '../models/Student.js'; // Adjust the import path as needed
import CacheHelper from '../services/CacheHelper.js';


export const getAllStudents = async (req: any, res: any, next: any) => {
    try {
        const response = await CacheHelper.getOrFetch(
            'all_students',
            async () => {
                const students = await Student.find();
                return {
                    success: true,
                    count: students.length,
                    data: students
                };
            }
        );
        
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