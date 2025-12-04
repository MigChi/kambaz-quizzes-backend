import * as dao from "./dao.js";

export default function EnrollmentRoutes(app) {
  app.get("/api/courses/:courseId/enrollments", async (req, res) => {
    const { courseId } = req.params;
    const enrollments = await dao.findEnrollmentsForCourse(courseId);
    res.json(enrollments);
  });

  app.get("/api/users/:userId/enrollments", async (req, res) => {
    let { userId } = req.params;

    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }

    const enrollments = await dao.findEnrollmentsForUser(userId);
    res.json(enrollments);
  });

  app.post("/api/enrollments", async (req, res) => {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) {
      res.status(400).json({ error: "userId and courseId are required" });
      return;
    }

    try {
      const enrollment = await dao.enrollUserInCourse(userId, courseId);
      res.json(enrollment);
    } catch (e) {
      if (e?.code === 11000) {
        res.status(409).json({ error: "Already enrolled" });
        return;
      }
      throw e;
    }
  });

  app.delete("/api/enrollments/:enrollmentId", async (req, res) => {
    const { enrollmentId } = req.params;
    const status = await dao.deleteEnrollmentById(enrollmentId);
    res.json(status);
  });

  app.delete("/api/enrollments", async (req, res) => {
    const { userId, courseId } = req.body;
    if (!userId || !courseId) {
      res.status(400).json({ error: "userId and courseId are required" });
      return;
    }
    const status = await dao.unenrollUserFromCourse(userId, courseId);
    res.json(status);
  });
}
