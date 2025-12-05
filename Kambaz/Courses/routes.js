import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app) {
  const dao = CoursesDao();
  const enrollmentsDao = EnrollmentsDao();

  const findAllCourses = async (req, res) => {
    const courses = await dao.findAllCourses();
    res.send(courses);
  };

  const findCoursesForEnrolledUser = async (req, res) => {
    let { userId } = req.params;
    if (userId === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      userId = currentUser._id;
    }

    const courses = await enrollmentsDao.findCoursesForUser(userId);
    res.json(courses);
  };

  const createCourse = async (req, res) => {
    // Try to use session user if available, but don't block if it's missing
    const currentUser = req.session["currentUser"];

    try {
      const newCourse = await dao.createCourse(req.body);

      // If we DO have a session user, we can still auto-enroll them (nice for local dev)
      if (currentUser && currentUser._id) {
        try {
          await enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
        } catch (e) {
          console.error("Auto-enroll in createCourse failed:", e);
          // don't fail the whole request
        }
      }

      res.json(newCourse);
    } catch (e) {
      console.error("Error in createCourse:", e);
      res.sendStatus(500);
    }
  };


  const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    await enrollmentsDao.unenrollAllUsersFromCourse(courseId);
    const status = await dao.deleteCourse(courseId);
    res.send(status);
  };

  const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const courseUpdates = req.body;
    const status = await dao.updateCourse(courseId, courseUpdates);
    res.send(status);
  };

  // get users enrolled in a specific course
  const findUsersForCourse = async (req, res) => {
    const { cid } = req.params;
    try {
      const users = await enrollmentsDao.findUsersForCourse(cid);
      res.json(users);
    } catch (e) {
      console.error("Error in findUsersForCourse:", e);
      res.sendStatus(500);
    }
  };

  const enrollUserInCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.enrollUserInCourse(uid, cid);
    res.send(status);
  };

  const unenrollUserFromCourse = async (req, res) => {
    let { uid, cid } = req.params;
    if (uid === "current") {
      const currentUser = req.session["currentUser"];
      if (!currentUser) {
        res.sendStatus(401);
        return;
      }
      uid = currentUser._id;
    }
    const status = await enrollmentsDao.unenrollUserFromCourse(uid, cid);
    res.send(status);
  };

  // routes wiring
  app.get("/api/courses", findAllCourses);
  app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
  app.post("/api/courses", createCourse);
  app.post("/api/users/current/courses", createCourse);
  app.put("/api/courses/:courseId", updateCourse);
  app.delete("/api/courses/:courseId", deleteCourse);

  // users for course
  app.get("/api/courses/:cid/users", findUsersForCourse);

  // enroll/unenroll
  app.post("/api/users/:uid/courses/:cid", enrollUserInCourse);
  app.delete("/api/users/:uid/courses/:cid", unenrollUserFromCourse);
}
