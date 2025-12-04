import * as dao from "./dao.js";

export default function AssignmentRoutes(app) {
  const deleteAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    const status = await dao.deleteAssignment(assignmentId);
    res.send(status);
  };

  const updateAssignment = async (req, res) => {
    const { assignmentId } = req.params;
    const updates = req.body;
    const status = await dao.updateAssignment(assignmentId, updates);
    if (!status?.matchedCount) {
      res.sendStatus(404);
      return;
    }
    res.send(status);
  };

  app.delete("/api/assignments/:assignmentId", deleteAssignment);
  app.put("/api/assignments/:assignmentId", updateAssignment);
}
