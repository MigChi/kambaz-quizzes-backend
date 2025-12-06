import * as attemptsDao from "./dao.js";

const QuizAttemptsRoutes = (app) => {
  // GET /api/quizzes/:qid/attempts/:uid
  app.get("/api/quizzes/:qid/attempts/:uid", async (req, res) => {
    const { qid, uid } = req.params;
    const attempts = await attemptsDao.findAttemptsForQuizAndStudent(qid, uid);
    res.json(attempts);
  });

  // POST /api/quizzes/:qid/attempts/:uid
  app.post("/api/quizzes/:qid/attempts/:uid", async (req, res) => {
    const { qid, uid } = req.params;
    const attempt = req.body;
    const created = await attemptsDao.createAttemptForQuizAndStudent(
      qid,
      uid,
      attempt
    );
    res.json(created);
  });
};

export default QuizAttemptsRoutes;
