import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
import Database from "../Database/index.js";

export const findAllCourses = () => model.find();

export const findCourseById = (courseId) => model.findById(courseId);

export const createCourse = (course) =>
  model.create({
    ...course,
    _id: course._id || uuidv4(),
    modules: course.modules ?? [],
  });

export const deleteCourse = (courseId) => model.deleteOne({ _id: courseId });

export const updateCourse = (courseId, courseUpdates) =>
  model.updateOne({ _id: courseId }, { $set: courseUpdates });

export const findCoursesForEnrolledUser = (userId) => {
  const { enrollments } = Database;
  const enrolledCourseIds = enrollments
    .filter((e) => e.user === userId)
    .map((e) => e.course);
  return model.find({ _id: { $in: enrolledCourseIds } });
};
