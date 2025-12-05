import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

export default function AssignmentsDao() {
  async function findAssignmentsForCourse(courseId) {
    return model.find({ course: courseId });
  }

  async function findAssignmentById(assignmentId) {
    return model.findById(assignmentId);
  }

  async function createAssignment(courseId, assignment) {
    const newAssignment = {
      ...assignment,
      _id: uuidv4(),
      course: courseId,
    };
    return model.create(newAssignment);
  }

  async function updateAssignment(assignmentId, updates) {
    await model.updateOne({ _id: assignmentId }, { $set: updates });
    // return fresh doc so UI always has latest
    return model.findById(assignmentId);
  }

  async function deleteAssignment(assignmentId) {
    return model.deleteOne({ _id: assignmentId });
  }

  return {
    findAssignmentsForCourse,
    findAssignmentById,
    createAssignment,
    updateAssignment,
    deleteAssignment,
  };
}
