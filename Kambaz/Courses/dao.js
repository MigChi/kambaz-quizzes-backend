import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

const DEFAULT_IMAGE = "/images/NU_CMYK_Notched-N_motto_RW.png"

export default function CoursesDao() {
  function findAllCourses() {
    return model.find({});
  }

  function createCourse(course) {
    const newCourse = { ...course, _id: uuidv4() };
    if (!newCourse.image) {
      newCourse.image = DEFAULT_IMAGE; 
    }
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
