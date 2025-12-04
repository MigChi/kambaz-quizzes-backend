import model from "./model.js";

export const findEnrollmentsForCourse = (courseId) =>
  model.find({ course: courseId });

export const findEnrollmentsForUser = (userId) =>
  model.find({ user: userId });

export const findCoursesForUser = async (userId) => {
  const enrollments = await model.find({ user: userId }).populate("course");
  return enrollments.map((enrollment) => enrollment.course);
};

export const findUsersForCourse = async (courseId) => {
  const enrollments = await model.find({ course: courseId }).populate("user");
  return enrollments.map((enrollment) => enrollment.user);
};

export const enrollUserInCourse = (userId, courseId) =>
  model.create({
    user: userId,
    course: courseId,
    _id: `${userId}-${courseId}`,
  });

export const unenrollUserFromCourse = (userId, courseId) =>
  model.deleteOne({ user: userId, course: courseId });

export const deleteEnrollmentById = (enrollmentId) =>
  model.deleteOne({ _id: enrollmentId });

export const unenrollAllUsersFromCourse = (courseId) =>
  model.deleteMany({ course: courseId });
