import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    _id: String,
    title: String,
    course: String,
    description: String,
    dueDate: Date,
    points: Number,
  },
  { collection: "assignments" }
);

export default schema;
