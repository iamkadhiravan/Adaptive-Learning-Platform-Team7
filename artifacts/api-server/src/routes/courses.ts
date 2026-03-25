import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  coursesTable,
  conceptsTable,
  enrollmentsTable,
} from "@workspace/db/schema";
import { eq, and } from "drizzle-orm";
import {
  ListCoursesResponse,
  GetCourseResponse,
  EnrollCourseResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const STUDENT_ID = 1;

router.get("/", async (_req, res) => {
  const courses = await db.select().from(coursesTable);
  const enrollments = await db
    .select()
    .from(enrollmentsTable)
    .where(eq(enrollmentsTable.studentId, STUDENT_ID));

  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));
  const enrollmentMap = new Map(
    enrollments.map((e) => [e.courseId, e.progress])
  );

  const data = ListCoursesResponse.parse(
    courses.map((c) => ({
      id: c.id,
      title: c.title,
      description: c.description,
      subject: c.subject,
      difficulty: c.difficulty,
      totalConcepts: c.totalConcepts,
      estimatedHours: c.estimatedHours,
      enrolledCount: c.enrolledCount,
      isEnrolled: enrolledCourseIds.has(c.id),
      progress: enrollmentMap.get(c.id) ?? null,
      thumbnailColor: c.thumbnailColor,
    }))
  );
  res.json(data);
});

router.post("/", async (req, res) => {
  const { title, description, subject, difficulty, estimatedHours } = req.body;
  const [course] = await db
    .insert(coursesTable)
    .values({
      title,
      description,
      subject,
      difficulty,
      estimatedHours,
    })
    .returning();
  res.status(201).json(course);
});

router.get("/:courseId", async (req, res) => {
  const courseId = parseInt(req.params.courseId);
  const course = await db.query.coursesTable.findFirst({
    where: eq(coursesTable.id, courseId),
  });

  if (!course) {
    res.status(404).json({ error: "Course not found" });
    return;
  }

  const concepts = await db
    .select()
    .from(conceptsTable)
    .where(eq(conceptsTable.courseId, courseId));

  const enrollment = await db.query.enrollmentsTable.findFirst({
    where: and(
      eq(enrollmentsTable.studentId, STUDENT_ID),
      eq(enrollmentsTable.courseId, courseId)
    ),
  });

  const data = GetCourseResponse.parse({
    id: course.id,
    title: course.title,
    description: course.description,
    subject: course.subject,
    difficulty: course.difficulty,
    totalConcepts: course.totalConcepts,
    estimatedHours: course.estimatedHours,
    isEnrolled: !!enrollment,
    progress: enrollment?.progress ?? null,
    concepts: concepts.map((c, i) => ({
      id: c.id,
      name: c.name,
      description: c.description,
      masteryLevel: 0.3 + i * 0.1,
      prerequisites: JSON.parse(c.prerequisites),
      isUnlocked: i < 3,
    })),
  });
  res.json(data);
});

router.post("/:courseId/enroll", async (req, res) => {
  const courseId = parseInt(req.params.courseId);

  const existing = await db.query.enrollmentsTable.findFirst({
    where: and(
      eq(enrollmentsTable.studentId, STUDENT_ID),
      eq(enrollmentsTable.courseId, courseId)
    ),
  });

  if (existing) {
    res.json(EnrollCourseResponse.parse({
      id: existing.id,
      courseId: existing.courseId,
      studentId: existing.studentId,
      enrolledAt: existing.enrolledAt.toISOString(),
      progress: existing.progress,
    }));
    return;
  }

  await db
    .update(coursesTable)
    .set({ enrolledCount: db.$count(enrollmentsTable) })
    .where(eq(coursesTable.id, courseId));

  const [enrollment] = await db
    .insert(enrollmentsTable)
    .values({
      studentId: STUDENT_ID,
      courseId,
      progress: 0,
    })
    .returning();

  res.json(EnrollCourseResponse.parse({
    id: enrollment.id,
    courseId: enrollment.courseId,
    studentId: enrollment.studentId,
    enrolledAt: enrollment.enrolledAt.toISOString(),
    progress: enrollment.progress,
  }));
});

export default router;
