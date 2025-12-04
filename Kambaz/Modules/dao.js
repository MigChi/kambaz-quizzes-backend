import { v4 as uuidv4 } from "uuid";
import coursesModel from "../Courses/model.js";

export const findModulesForCourse = async (courseId) => {
  const course = await coursesModel.findById(courseId);
  return course?.modules ?? [];
};

export const createModule = async (courseId, module) => {
  const newModule = {
    _id: module._id || uuidv4(),
    lessons: module.lessons ?? [],
    ...module,
  };
  await coursesModel.updateOne(
    { _id: courseId },
    { $push: { modules: newModule } }
  );
  return newModule;
};

export const deleteModule = (courseId, moduleId) =>
  coursesModel.updateOne(
    { _id: courseId },
    { $pull: { modules: { _id: moduleId } } }
  );

export const updateModule = async (courseId, moduleId, moduleUpdates) => {
  const course = await coursesModel.findById(courseId);
  if (!course) {
    return null;
  }
  const module = course.modules.id(moduleId);
  if (!module) {
    return null;
  }
  Object.assign(module, moduleUpdates);
  await course.save();
  return module;
};
