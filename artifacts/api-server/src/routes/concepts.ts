import { Router, type IRouter } from "express";
import { ListConceptsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/", (_req, res) => {
  const data = ListConceptsResponse.parse({
    nodes: [
      { id: 1, name: "Python Basics", subject: "Programming", masteryLevel: 0.92, x: 100, y: 200 },
      { id: 2, name: "Data Types", subject: "Programming", masteryLevel: 0.88, x: 250, y: 100 },
      { id: 3, name: "Functions", subject: "Programming", masteryLevel: 0.85, x: 250, y: 300 },
      { id: 4, name: "Classes & OOP", subject: "Programming", masteryLevel: 0.72, x: 400, y: 200 },
      { id: 5, name: "Linear Algebra", subject: "Mathematics", masteryLevel: 0.65, x: 550, y: 100 },
      { id: 6, name: "Calculus", subject: "Mathematics", masteryLevel: 0.45, x: 550, y: 300 },
      { id: 7, name: "Statistics", subject: "Mathematics", masteryLevel: 0.70, x: 700, y: 200 },
      { id: 8, name: "Machine Learning", subject: "ML", masteryLevel: 0.50, x: 850, y: 150 },
      { id: 9, name: "Neural Networks", subject: "ML", masteryLevel: 0.40, x: 850, y: 300 },
      { id: 10, name: "Gradient Descent", subject: "ML", masteryLevel: 0.32, x: 1000, y: 200 },
      { id: 11, name: "Backpropagation", subject: "ML", masteryLevel: 0.22, x: 1000, y: 350 },
      { id: 12, name: "Data Structures", subject: "CS", masteryLevel: 0.80, x: 400, y: 420 },
      { id: 13, name: "Algorithms", subject: "CS", masteryLevel: 0.75, x: 550, y: 450 },
      { id: 14, name: "Recursion", subject: "CS", masteryLevel: 0.55, x: 700, y: 420 },
    ],
    edges: [
      { source: 1, target: 2, type: "prerequisite" },
      { source: 1, target: 3, type: "prerequisite" },
      { source: 2, target: 4, type: "prerequisite" },
      { source: 3, target: 4, type: "prerequisite" },
      { source: 4, target: 8, type: "related" },
      { source: 5, target: 8, type: "prerequisite" },
      { source: 6, target: 8, type: "prerequisite" },
      { source: 7, target: 8, type: "prerequisite" },
      { source: 8, target: 9, type: "prerequisite" },
      { source: 8, target: 10, type: "prerequisite" },
      { source: 9, target: 11, type: "prerequisite" },
      { source: 10, target: 11, type: "related" },
      { source: 1, target: 12, type: "prerequisite" },
      { source: 12, target: 13, type: "prerequisite" },
      { source: 13, target: 14, type: "prerequisite" },
    ],
  });
  res.json(data);
});

export default router;
