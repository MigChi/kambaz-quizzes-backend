import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    course: String, // e.g. "RS101"

    points: { type: Number, default: 0 },

    // Quiz Details props
    quizType: {
      type: String,
      default: "Graded Quiz", // "Graded Quiz", "Practice Quiz", etc.
    },
    assignmentGroup: {
      type: String,
      default: "Quizzes", // "Quizzes", "Exams", etc.
    },

    published: { type: Boolean, default: false },

    shuffleAnswers: {
      type: String,
      enum: ["Yes", "No"],
      default: "Yes",
    },
    timeLimit: { type: Number, default: 20 },

    multipleAttempts: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    allowedAttempts: { type: Number, default: 1 },

    showCorrectAnswers: { type: String, default: "" },
    accessCode: { type: String, default: "" },

    oneQuestionAtATime: {
      type: String,
      enum: ["Yes", "No"],
      default: "Yes",
    },
    webcamRequired: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },
    lockQuestionsAfterAnswering: {
      type: String,
      enum: ["Yes", "No"],
      default: "No",
    },

    // dates as strings (matches how your Assignments UI uses them)
    dueDate: { type: String, default: null },
    availableFrom: { type: String, default: null },
    availableUntil: { type: String, default: null },

    // for future questions editor
    questions: { type: Array, default: [] }
  },
  { collection: "quizzes" }
);

export default quizSchema;
