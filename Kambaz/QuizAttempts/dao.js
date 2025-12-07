import quizAttemptModel from "./model.js";

export const createAttempt = (attempt) =>
  quizAttemptModel.create(attempt);

export const findAttemptsForUserAndQuiz = (quizId, userId) =>
  quizAttemptModel
    .find({ quizId, userId })
    .sort({ attemptNumber: -1, submittedAt: -1 });

export const findLatestAttemptForUserAndQuiz = (quizId, userId) =>
  quizAttemptModel
    .findOne({ quizId, userId })
    .sort({ attemptNumber: -1, submittedAt: -1 });
