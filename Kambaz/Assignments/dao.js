import { v4 as uuidv4 } from "uuid";
import model from "./model.js";

export const findAssignmentsForCourse = (courseId) =>
  model.find({ course: courseId });

export const createAssignment = (assignment) =>
  model.create({
    ...assignment,
    _id: assignment._id || uuidv4(),
  });

export const deleteAssignment = (assignmentId) =>
  model.deleteOne({ _id: assignmentId });

export const updateAssignment = (assignmentId, updates) =>
  model.updateOne({ _id: assignmentId }, { $set: updates });
