import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  contact: {
    type: String,
    required: false,
  },
  website: {
    type: String,
    required: false,
  },
});

const Doc = mongoose.model("Doc", doctorSchema);

export default Doc;
