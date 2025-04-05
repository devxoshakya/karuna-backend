import mongoose, { Document, Schema } from 'mongoose';

export interface Student extends Document {
    overall_s_no: number;
    s_no: number;
    course: string;
    branch: string;
    year: number;
    rollNo: number;
    enrollNo: number;
    name: string;
    DOB: string;
    SGPA: {
        sem1: number;
        sem2: number;
        sem3: number;
        sem4: number;
        sem5: number;
        sem6: number;
        sem7: number;
        sem8: number;
    };
}

const SGPASchema = new Schema({
    sem1: { type: Number },
    sem2: { type: Number },
    sem3: { type: Number },
    sem4: { type: Number },
    sem5: { type: Number },
    sem6: { type: Number },
    sem7: { type: Number },
    sem8: { type: Number },
});

const StudentSchema = new Schema<Student>({
    overall_s_no: {
        type: Number,
        required: false,
    },
    s_no: {
        type: Number,
        required: false,
    },
    course: {
        type: String,
        required: false,
    },
    branch: {
        type: String,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    rollNo: {
        type: Number,
        required: true,
    },
    enrollNo: {
        type: Number,
        required: false,
    },
    name: {
        type: String,
        required: true,
    },
    SGPA: {
        type: SGPASchema,
        required: true,
    },
});

export default mongoose.model<Student>('Student', StudentSchema);
