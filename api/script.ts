import * as fs from 'fs';
import * as path from 'path';
import ConnectDB from '../src/db/ConnectDB.js';
import Student from '../src/models/Student.js';

async function importStudentData() {
    try {
        // Connect to MongoDB
        await ConnectDB(process.env.MONGODB_URI!);

        // Read the JSON file
        const filePath = path.join(__dirname, 'data.json');
        const rawData = fs.readFileSync(filePath, 'utf-8');
        const students = JSON.parse(rawData);

        console.log(`Found ${students.length} students to import`);

        // Process each student record
        for (const student of students) {
            await Student.create({
                name: student.name,
                rollNo: student.rollNo,
                enrollNo: student.enrollNo,
                course: student.course,
                branch: student.branch,
                year: student.year,
                SGPA: student.SGPA,
                overall_s_no: student.overall_s_no,
                s_no: student.s_no
                // Add any other fields from your model as needed
            });
        }

        console.log('Student data import completed successfully');
    } catch (error) {
        console.error('Error importing student data:', error);
    }
}

// Run the import function
importStudentData()
    .then(() => console.log('Import script completed'))
    .catch((error) => console.error('Import script failed:', error));
