import quizAttemptModel from "./model.js";

export const findAttemptsForQuizAndStudent = (quizId, studentId) =>
  quizAttemptModel
    .find({ quiz: quizId, student: studentId })
    .sort({ attemptNumber: 1, submittedAt: 1 });

export const createAttemptForQuizAndStudent = async (
  quizId,
  studentId,
  attempt
) => {
  const existingCount = await quizAttemptModel.countDocuments({
    quiz: quizId,
    student: studentId,
  });
  const attemptNumber = existingCount + 1;
  return quizAttemptModel.create({
    ...attempt,
    quiz: quizId,
    student: studentId,
    attemptNumber,
  });
};
