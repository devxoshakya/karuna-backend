import mongoose, { Document, Schema } from 'mongoose';

export interface Drug extends Document {
    srNo: number;
    drugCode: string;
    genericName: string;
    unitSize: string;
    mrp: number;
}

const DrugSchema = new Schema<Drug>({
    srNo: {
        type: Number,
        required: true,
    },
    drugCode: {
        type: String,
        required: true,
    },
    genericName: {
        type: String,
        required: true,
    },
    unitSize: {
        type: String,
        required: true,
    },
    mrp: {
        type: Number,
        required: true,
    },
});

export default mongoose.model<Drug>('Drug', DrugSchema);
