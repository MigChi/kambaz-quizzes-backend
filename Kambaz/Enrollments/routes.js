import EnrollmentsDao from "./dao.js";

export default function EnrollmentsRoutes(app) {
  const dao = EnrollmentsDao();

  app.get("/api/enrollments", async (req, res) => {
    const enrollments = await dao.findAllEnrollments();
    res.json(enrollments);
  });

  app.post("/api/users/:userId/courses/:courseId/enroll", async (req, res) => {
    const { userId, courseId } = req.params;
    const enrollment = await dao.enrollUserInCourse(userId, courseId);
    res.json(enrollment);
  });

  app.delete(
    "/api/users/:userId/courses/:courseId/enroll",
    async (req, res) => {
      const { userId, courseId } = req.params;
      const result = await dao.unenrollUserFromCourse(userId, courseId);
      res.json(result);
    }
  );
}
