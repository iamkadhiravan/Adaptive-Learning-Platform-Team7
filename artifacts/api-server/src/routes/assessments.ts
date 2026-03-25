import { Router, type IRouter } from "express";
import {
  ListAssessmentsResponse,
  SubmitAssessmentResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/", (_req, res) => {
  const data = ListAssessmentsResponse.parse([
    { id: 1, title: "Python Fundamentals Quiz", courseId: 1, courseName: "Python Programming", questionCount: 10, timeLimit: 15, status: "completed", score: 0.82, adaptiveLevel: "medium" },
    { id: 2, title: "Machine Learning Concepts", courseId: 2, courseName: "Machine Learning", questionCount: 15, timeLimit: 25, status: "pending", score: null, adaptiveLevel: "hard" },
    { id: 3, title: "Linear Algebra Basics", courseId: 3, courseName: "Mathematics for ML", questionCount: 12, timeLimit: 20, status: "pending", score: null, adaptiveLevel: "medium" },
    { id: 4, title: "Neural Networks Deep Dive", courseId: 2, courseName: "Machine Learning", questionCount: 20, timeLimit: 35, status: "pending", score: null, adaptiveLevel: "hard" },
    { id: 5, title: "Data Structures & Algorithms", courseId: 4, courseName: "Computer Science", questionCount: 10, timeLimit: 20, status: "completed", score: 0.90, adaptiveLevel: "medium" },
  ]);
  res.json(data);
});

router.post("/:assessmentId/submit", (req, res) => {
  const assessmentId = parseInt(req.params.assessmentId);
  const { answers, timeTaken } = req.body;

  const correct = Math.floor(answers.length * (0.6 + Math.random() * 0.35));
  const score = correct / answers.length;
  const xpEarned = Math.floor(score * 100);

  const data = SubmitAssessmentResponse.parse({
    assessmentId,
    score,
    correctAnswers: correct,
    totalQuestions: answers.length,
    xpEarned,
    conceptsImproved: ["Gradient Descent", "Loss Functions"],
    feedback: score >= 0.8
      ? "Excellent performance! You have a strong grasp of these concepts. Ready to advance."
      : score >= 0.6
      ? "Good effort. Review the sections on optimization before moving forward."
      : "Keep practicing. Focus on the fundamentals and try again after reviewing the material.",
    nextRecommendation: score >= 0.8
      ? "Move on to Advanced Neural Networks"
      : "Review Gradient Descent and Backpropagation",
  });
  res.json(data);
});

export default router;
