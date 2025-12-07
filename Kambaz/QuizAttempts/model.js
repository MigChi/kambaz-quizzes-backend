import mongoose from "mongoose";
import quizAttemptSchema from "./schema.js";

const quizAttemptModel = mongoose.model(
  "QuizAttemptModel",
  quizAttemptSchema
);

export default quizAttemptModel;
