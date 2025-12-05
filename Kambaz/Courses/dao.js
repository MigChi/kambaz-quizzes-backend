import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function CoursesDao(_db) {
  function findAllCourses() {
    // Only send name + description (and _id by default)
    return model.find({}, { name: 1, description: 1 });
  }

  // NOTE: This is no longer used; the route now uses enrollmentsDao.findCoursesForUser()
  // so we don't define findCoursesForEnrolledUser anymore.

  function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    return model.create(newCourse);
  }

  function deleteCourse(courseId) {
    // All enrollment cleanup is now done in EnrollmentsDao
    return model.deleteOne({ _id: courseId });
  }

  function updateCourse(courseId, courseUpdates) {
    return model.updateOne({ _id: courseId }, { $set: courseUpdates });
  }

  return {
    findAllCourses,
    createCourse,
    deleteCourse,
    updateCourse,
  };
}
