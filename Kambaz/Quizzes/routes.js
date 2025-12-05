import * as dao from "./dao.js";

const QuizzesRoutes = (app) => {
  // GET /api/courses/:cid/quizzes
  app.get("/api/courses/:cid/quizzes", async (req, res) => {
    const { cid } = req.params;
    const quizzes = await dao.findQuizzesForCourse(cid);
    res.json(quizzes);
  });

  // POST /api/courses/:cid/quizzes
  app.post("/api/courses/:cid/quizzes", async (req, res) => {
    const { cid } = req.params;
    const quiz = req.body;
    const newQuiz = await dao.createQuizForCourse(cid, quiz);
    res.json(newQuiz);
  });

  // GET /api/quizzes/:qid
  app.get("/api/quizzes/:qid", async (req, res) => {
    const { qid } = req.params;
    const quiz = await dao.findQuizById(qid);
    res.json(quiz);
  });

  // PUT /api/quizzes/:qid
  app.put("/api/quizzes/:qid", async (req, res) => {
    const { qid } = req.params;
    const quiz = req.body;
    await dao.updateQuiz(qid, quiz);
    const updated = await dao.findQuizById(qid);
    res.json(updated);
  });

  // DELETE /api/quizzes/:qid
  app.delete("/api/quizzes/:qid", async (req, res) => {
    const { qid } = req.params;
    const status = await dao.deleteQuiz(qid);
    res.json(status);
  });
};

export default QuizzesRoutes;
