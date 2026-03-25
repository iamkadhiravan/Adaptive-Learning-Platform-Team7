import { Router, type IRouter } from "express";
import {
  GetProgressResponse,
  GetMemoryGraphResponse,
  GetKnowledgeGapsResponse,
  GetForgettingCurveResponse,
  GetLearningPathResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/", (_req, res) => {
  const data = GetProgressResponse.parse({
    enrolledCourses: 3,
    completedCourses: 1,
    masteredConcepts: 14,
    totalConcepts: 42,
    averageRetention: 78.5,
    weeklyGoalProgress: 0.7,
    studyTimeThisWeek: 210,
    assessmentsPassed: 5,
  });
  res.json(data);
});

router.get("/memory-graph", (_req, res) => {
  const today = new Date();
  const data = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (29 - i));
    const base = 55 + Math.sin(i * 0.3) * 10 + i * 0.7;
    return {
      date: date.toISOString().split("T")[0],
      retention: Math.min(95, Math.max(40, base + (Math.random() * 8 - 4))),
      conceptsStudied: Math.floor(2 + Math.random() * 5),
      studyMinutes: Math.floor(15 + Math.random() * 45),
    };
  });
  res.json(GetMemoryGraphResponse.parse(data));
});

router.get("/knowledge-gaps", (_req, res) => {
  const data = GetKnowledgeGapsResponse.parse([
    {
      id: 1,
      conceptName: "Gradient Descent",
      subject: "Machine Learning",
      masteryLevel: 0.32,
      recommendedAction: "Review optimization algorithms and practice 5 problems",
      priority: "high",
      relatedConcepts: ["Backpropagation", "Loss Functions", "Learning Rate"],
    },
    {
      id: 2,
      conceptName: "Calculus - Integration",
      subject: "Mathematics",
      masteryLevel: 0.45,
      recommendedAction: "Practice integration by parts with examples",
      priority: "high",
      relatedConcepts: ["Derivatives", "Series", "Differential Equations"],
    },
    {
      id: 3,
      conceptName: "Recursion",
      subject: "Computer Science",
      masteryLevel: 0.55,
      recommendedAction: "Implement 3 recursive algorithms from scratch",
      priority: "medium",
      relatedConcepts: ["Stack Memory", "Tree Traversal", "Dynamic Programming"],
    },
    {
      id: 4,
      conceptName: "Eigenvalues",
      subject: "Linear Algebra",
      masteryLevel: 0.61,
      recommendedAction: "Review matrix decomposition and SVD",
      priority: "medium",
      relatedConcepts: ["Matrix Operations", "Determinants", "PCA"],
    },
    {
      id: 5,
      conceptName: "Big O Notation",
      subject: "Computer Science",
      masteryLevel: 0.68,
      recommendedAction: "Analyze time complexity for common algorithms",
      priority: "low",
      relatedConcepts: ["Algorithms", "Data Structures", "Sorting"],
    },
  ]);
  res.json(data);
});

router.get("/forgetting-curve", (_req, res) => {
  const today = new Date();
  const makeDate = (daysAgo: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() - daysAgo);
    return d.toISOString().split("T")[0];
  };
  const makeNext = (daysFromNow: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + daysFromNow);
    return d.toISOString().split("T")[0];
  };

  const data = GetForgettingCurveResponse.parse([
    { conceptName: "Gradient Descent", lastStudied: makeDate(14), retentionNow: 0.32, retentionAtStudy: 0.92, nextReviewDate: makeNext(0), daysSinceStudied: 14 },
    { conceptName: "Neural Networks", lastStudied: makeDate(7), retentionNow: 0.58, retentionAtStudy: 0.88, nextReviewDate: makeNext(1), daysSinceStudied: 7 },
    { conceptName: "Python Basics", lastStudied: makeDate(2), retentionNow: 0.82, retentionAtStudy: 0.95, nextReviewDate: makeNext(5), daysSinceStudied: 2 },
    { conceptName: "Linear Algebra", lastStudied: makeDate(10), retentionNow: 0.45, retentionAtStudy: 0.85, nextReviewDate: makeNext(0), daysSinceStudied: 10 },
    { conceptName: "Statistics", lastStudied: makeDate(5), retentionNow: 0.65, retentionAtStudy: 0.90, nextReviewDate: makeNext(3), daysSinceStudied: 5 },
    { conceptName: "Backpropagation", lastStudied: makeDate(21), retentionNow: 0.22, retentionAtStudy: 0.87, nextReviewDate: makeNext(0), daysSinceStudied: 21 },
    { conceptName: "Recursion", lastStudied: makeDate(3), retentionNow: 0.75, retentionAtStudy: 0.93, nextReviewDate: makeNext(4), daysSinceStudied: 3 },
  ]);
  res.json(data);
});

router.get("/learning-path", (_req, res) => {
  const data = GetLearningPathResponse.parse({
    nextConcepts: [
      { conceptId: 12, conceptName: "Gradient Descent", reason: "Critical gap detected — only 32% mastery but required for 4 advanced topics", estimatedMinutes: 45, priority: 1 },
      { conceptId: 8, conceptName: "Backpropagation", reason: "Memory decay detected — last studied 21 days ago, retention at 22%", estimatedMinutes: 30, priority: 2 },
      { conceptId: 15, conceptName: "Calculus Integration", reason: "Prerequisite for upcoming Neural Networks module", estimatedMinutes: 60, priority: 3 },
      { conceptId: 3, conceptName: "Recursion", reason: "75% mastery — one more review session will lock this in", estimatedMinutes: 20, priority: 4 },
    ],
    recommendedCourses: [1, 2],
    estimatedTimeToMastery: 18,
    aiInsight: "Based on your learning patterns, you retain concepts best in the morning with 25-minute focused sessions. Your visual learning style means concept maps and diagrams accelerate mastery by 40%. Focus on Gradient Descent this week — it unlocks 6 advanced ML concepts.",
  });
  res.json(data);
});

export default router;
