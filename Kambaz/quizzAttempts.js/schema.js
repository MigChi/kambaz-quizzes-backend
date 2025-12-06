import mongoose from "mongoose";

const quizAttemptSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuizModel",
      required: true,
    },
    student: {
      type: String, // store user _id as string
      required: true,
    },
    attemptNumber: {
      type: Number,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
    maxScore: {
      type: Number,
      default: 0,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    answers: [
      {
        questionId: String,
        answerType: String, // "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_BLANK"
        selectedChoiceId: String,
        trueFalseSelection: String,
        fillBlankResponse: String,
        isCorrect: Boolean,
        earnedPoints: Number,
      },
    ],
  },
  { collection: "quizAttempts" }
);

export default quizAttemptSchema;
