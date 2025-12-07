import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: String,
    questionTitle: String,
    prompt: String,
    questionType: {
      type: String,
      enum: ["MULTIPLE_CHOICE", "TRUE_FALSE", "FILL_BLANK"],
    },
    points: Number,
    selectedChoiceId: String,
    selectedChoiceText: String,
    trueFalseSelection: {
      type: String,
      enum: ["TRUE", "FALSE"],
    },
    fillBlankResponse: String,
    correctAnswerSummary: String,
    isCorrect: Boolean,
    earnedPoints: Number,
    multipleChoiceOptionsSnapshot: [
      new mongoose.Schema(
        {
          id: String,
          text: String,
          isCorrect: Boolean,
        },
        { _id: false }
      ),
    ],
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "QuizModel" },
    courseId: String,
    userId: String,
    attemptNumber: Number,
    submittedAt: { type: Date, default: Date.now },
    score: Number,
    maxScore: Number,
    answers: [answerSchema],
  },
  { collection: "quizAttempts" }
);

export default quizAttemptSchema;
