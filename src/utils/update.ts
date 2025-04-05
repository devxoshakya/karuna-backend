import { solver } from "./solver.js";
import ConnectDB from "../db/ConnectDB.js";
import Student from "../models/Student.js";

async function updateStudentData() {
  try {
    // Connect to MongoDB
    await ConnectDB(process.env.MONGODB_URI!);

    // Fetch all students from the database
    const students = await Student.find({year: 4}).select("rollNo");

    console.log(`Found ${students.length} students to update`);

    // Process each student record
    for (const student of students) {
      const updatedData = await solver(student.rollNo);
      if (updatedData) {
        // Update the student's SGPA in the database
        console.log(`Updating data for roll number: ${student.rollNo}`);
        console.log(`Updated SGPA: ${JSON.stringify(updatedData.SGPA)}`);
        console.log(`student name: ${JSON.stringify(updatedData.fullName)}`);
        await Student.updateOne(
          { rollNo: student.rollNo },
            {
                $set: {
                SGPA: updatedData.SGPA,
                },
            }
        );
        console.log(`Updated data for roll number: ${student.rollNo}`);
      } else {
        console.log(`No data found for roll number: ${student.rollNo}`);
      }
    }

    console.log("Student data update completed successfully");
  } catch (error) {
    console.error("Error updating student data:", error);
  }
}

// Run the update function
updateStudentData()
    .then(() => console.log("Update script completed"))
    .catch((error) => console.error("Update script failed:", error));
//
//   const semester = $(elem)