import Student from '../models/Student.js'; // Adjust the import path as needed
import ConnectDB from '../db/ConnectDB.js';


export const getAllStudents = async (req: any, res: any, next: any) => {
    try {
        await ConnectDB(process.env.MONGODB_URI!);
        const students = await Student.find();
        
        return res.status(200).json({
            success: true,
            count: students.length,
            data: students
        });
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