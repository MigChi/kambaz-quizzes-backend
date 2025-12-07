import * as attemptsDao from "./dao.js";
import quizModel from "../Quizzes/model.js";

const normalizeQuestionType = (rawType = "") => {
  const compact = rawType.replace(/[\s_-]/g, "").toUpperCase();
  if (compact === "TRUEFALSE") return "TRUE_FALSE";
  if (compact === "FILLINTHEBLANK" || compact === "FILLBLANK") {
    return "FILL_BLANK";
  }
  return "MULTIPLE_CHOICE";
};

const normalizeTrueFalseAnswer = (answer) => {
  if (typeof answer === "string") {
    return answer.trim().toUpperCase() === "FALSE" ? "FALSE" : "TRUE";
  }
  return answer === false ? "FALSE" : "TRUE";
};

const convertChoices = (choices = []) => {
  if (!Array.isArray(choices)) {
    return [];
  }
  return choices.map((choice) => ({
    id: choice?.id || choice?._id?.toString(),
    text: choice?.text ?? "",
    isCorrect: Boolean(choice?.correct),
  }));
};

const convertBlanks = (blanks = []) => {
  if (!Array.isArray(blanks)) {
    return [];
  }
  return blanks
    .map((blank) =>
      typeof blank === "string" ? blank : blank?.text ?? ""
    )
    .map((text) => text.trim())
    .filter((text) => text.length > 0);
};

const convertQuizQuestionForEvaluation = (question, index) => {
  const questionId =
    question?._id?.toString() ?? `${question.quizId || "quiz"}-${index}`;
  return {
    questionId,
    questionTitle: question?.title ?? `Question ${index + 1}`,
    prompt:
      question?.questionText ?? question?.question ?? question?.prompt ?? "",
    questionType: normalizeQuestionType(
      question?.type ?? question?.questionType
    ),
    points: Number(question?.points ?? 0),
    multipleChoiceOptions: convertChoices(question?.choices),
    trueFalseAnswer: normalizeTrueFalseAnswer(question?.trueFalseAnswer),
    acceptableFillBlankAnswers: convertBlanks(question?.blanks),
  };
};

const evaluateQuizAttempt = (quiz, submittedAnswers = []) => {
  const questions = Array.isArray(quiz.questions) ? quiz.questions : [];
  const preparedQuestions = questions.map(convertQuizQuestionForEvaluation);
  const evaluations = preparedQuestions.map((question) => {
    const submitted = submittedAnswers.find(
      (answer) => answer.questionId === question.questionId
    );
    let isCorrect = false;
    let earnedPoints = 0;
    let selectedChoiceText = "";

    if (question.questionType === "MULTIPLE_CHOICE") {
      const selectedChoice = question.multipleChoiceOptions.find(
        (choice) => choice.id === submitted?.selectedChoiceId
      );
      isCorrect = Boolean(selectedChoice?.isCorrect);
      selectedChoiceText = selectedChoice?.text ?? "";
    } else if (question.questionType === "TRUE_FALSE") {
      const selection = submitted?.trueFalseSelection ?? "TRUE";
      isCorrect = selection === question.trueFalseAnswer;
    } else {
      const response = (submitted?.fillBlankResponse ?? "")
        .trim()
        .toLowerCase();
      isCorrect = question.acceptableFillBlankAnswers.some(
        (answer) => answer.trim().toLowerCase() === response
      );
    }

    if (isCorrect) {
      earnedPoints = question.points;
    }

    const correctAnswerSummary =
      question.questionType === "MULTIPLE_CHOICE"
        ? question.multipleChoiceOptions
            .filter((choice) => choice.isCorrect)
            .map((choice) => choice.text)
            .join(", ")
        : question.questionType === "TRUE_FALSE"
        ? question.trueFalseAnswer === "TRUE"
          ? "True"
          : "False"
        : question.acceptableFillBlankAnswers.join(", ");

    return {
      questionId: question.questionId,
      questionTitle: question.questionTitle,
      prompt: question.prompt,
      questionType: question.questionType,
      points: question.points,
      selectedChoiceId: submitted?.selectedChoiceId,
      selectedChoiceText,
      trueFalseSelection: submitted?.trueFalseSelection,
      fillBlankResponse: submitted?.fillBlankResponse ?? "",
      correctAnswerSummary,
      isCorrect,
      earnedPoints,
      multipleChoiceOptionsSnapshot: question.multipleChoiceOptions,
    };
  });

  const score = evaluations.reduce(
    (sum, evaluation) => sum + evaluation.earnedPoints,
    0
  );
  const maxScore = preparedQuestions.reduce(
    (sum, question) => sum + question.points,
    0
  );

  return { evaluations, score, maxScore };
};

const requireCurrentUser = (req, res) => {
  const currentUser = req.session["currentUser"];
  if (!currentUser) {
    res.sendStatus(401);
    return null;
  }
  return currentUser;
};

const computeAttemptLimit = (quiz) => {
  if (quiz.multipleAttempts === "Yes") {
    return Number(quiz.allowedAttempts || 1);
  }
  return 1;
};

const QuizAttemptsRoutes = (app) => {
  app.get("/api/quizzes/:qid/attempts/current", async (req, res) => {
    const currentUser = requireCurrentUser(req, res);
    if (!currentUser) return;
    const { qid } = req.params;
    const attempts = await attemptsDao.findAttemptsForUserAndQuiz(
      qid,
      currentUser._id
    );
    if (req.query.latest === "true") {
      res.json(attempts[0] ?? null);
    } else {
      res.json(attempts);
    }
  });

  app.post("/api/quizzes/:qid/attempts", async (req, res) => {
    const currentUser = requireCurrentUser(req, res);
    if (!currentUser) return;
    const { qid } = req.params;
    const quiz = await quizModel.findById(qid);
    if (!quiz) {
      res.sendStatus(404);
      return;
    }

    const existingAttempts = await attemptsDao.findAttemptsForUserAndQuiz(
      qid,
      currentUser._id
    );
    const attemptLimit = computeAttemptLimit(quiz);
    const nextAttemptNumber = (existingAttempts[0]?.attemptNumber || 0) + 1;
    if (nextAttemptNumber > attemptLimit) {
      res.status(403).json({
        message: "Attempt limit reached for this quiz.",
      });
      return;
    }

    const submittedAnswers = Array.isArray(req.body.answers)
      ? req.body.answers
      : [];
    const { evaluations, score, maxScore } = evaluateQuizAttempt(
      quiz,
      submittedAnswers
    );

    const attemptPayload = {
      quizId: quiz._id,
      courseId: quiz.course,
      userId: currentUser._id,
      attemptNumber: nextAttemptNumber,
      submittedAt: new Date(),
      score,
      maxScore,
      answers: evaluations,
    };

    const createdAttempt = await attemptsDao.createAttempt(attemptPayload);
    res.json(createdAttempt);
  });
};

export default QuizAttemptsRoutes;
