import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { studentsTable, memoryGraphTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import {
  GetStudentResponse,
  UpdateStudentBody,
  GetDashboardStatsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

async function getOrCreateStudent(studentId: number = 1) {
  let student = await db.query.studentsTable.findFirst({
    where: eq(studentsTable.id, studentId),
  });
  if (!student) {
    const [created] = await db
      .insert(studentsTable)
      .values({
        id: 1,
        name: "Alex Chen",
        email: "alex.chen@learnnova.com",
        learningStyle: "visual",
        streakDays: 7,
        totalXp: 1250,
        level: 5,
      })
      .onConflictDoNothing()
      .returning();
    student = created;
  }
  return student;
}

router.get("/me", async (req, res) => {
  const student = await getOrCreateStudent();
  const data = GetStudentResponse.parse({
    id: student!.id,
    name: student!.name,
    email: student!.email,
    avatar: student!.avatar,
    learningStyle: student!.learningStyle,
    streakDays: student!.streakDays,
    totalXp: student!.totalXp,
    level: student!.level,
    createdAt: student!.createdAt,
  });
  res.json(data);
});

router.put("/me", async (req, res) => {
  const body = UpdateStudentBody.parse(req.body);
  await db
    .update(studentsTable)
    .set(body)
    .where(eq(studentsTable.id, 1));
  const student = await getOrCreateStudent();
  res.json({
    id: student!.id,
    name: student!.name,
    email: student!.email,
    avatar: student!.avatar,
    learningStyle: student!.learningStyle,
    streakDays: student!.streakDays,
    totalXp: student!.totalXp,
    level: student!.level,
    createdAt: student!.createdAt.toISOString(),
  });
});

router.get("/dashboard/stats", async (_req, res) => {
  const student = await getOrCreateStudent();
  const data = GetDashboardStatsResponse.parse({
    streakDays: student!.streakDays,
    totalXp: student!.totalXp,
    level: student!.level,
    enrolledCourses: 3,
    masteredConcepts: 14,
    averageRetention: 78.5,
    weeklyStudyMinutes: 210,
    recentActivity: [
      { type: "quiz", description: "Completed Python Basics quiz", timeAgo: "2 hours ago", xpGained: 50 },
      { type: "lesson", description: "Studied Neural Networks concepts", timeAgo: "5 hours ago", xpGained: 30 },
      { type: "streak", description: "7-day streak achieved!", timeAgo: "1 day ago", xpGained: 100 },
      { type: "lesson", description: "Reviewed Linear Algebra", timeAgo: "2 days ago", xpGained: 25 },
    ],
    upcomingReviews: [
      { conceptName: "Gradient Descent", dueIn: "Today", retentionLevel: 0.45 },
      { conceptName: "Backpropagation", dueIn: "Tomorrow", retentionLevel: 0.58 },
      { conceptName: "Calculus Derivatives", dueIn: "In 2 days", retentionLevel: 0.72 },
    ],
  });
  res.json(data);
});

export default router;
