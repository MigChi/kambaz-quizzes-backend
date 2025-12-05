import quizModel from "./model.js";

export const findQuizzesForCourse = (courseId) =>
  quizModel.find({ course: courseId });

export const findQuizById = (quizId) =>
  quizModel.findById(quizId);

export const createQuizForCourse = (courseId, quiz) =>
  quizModel.create({ ...quiz, course: courseId });

export const updateQuiz = (quizId, quiz) =>
  quizModel.updateOne({ _id: quizId }, quiz);

export const deleteQuiz = (quizId) =>
  quizModel.deleteOne({ _id: quizId });
