import { pgTable, serial, text, integer, real, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { studentsTable } from "./students";

export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  subject: text("subject").notNull(),
  difficulty: text("difficulty").notNull().default("beginner"),
  totalConcepts: integer("total_concepts").notNull().default(0),
  estimatedHours: integer("estimated_hours").notNull().default(5),
  enrolledCount: integer("enrolled_count").notNull().default(0),
  thumbnailColor: text("thumbnail_color").notNull().default("#6366f1"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const conceptsTable = pgTable("concepts", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => coursesTable.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  prerequisites: text("prerequisites").notNull().default("[]"),
  posX: real("pos_x").notNull().default(0),
  posY: real("pos_y").notNull().default(0),
});

export const enrollmentsTable = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => studentsTable.id),
  courseId: integer("course_id").notNull().references(() => coursesTable.id),
  progress: real("progress").notNull().default(0),
  enrolledAt: timestamp("enrolled_at").notNull().defaultNow(),
});

export const studentConceptProgressTable = pgTable("student_concept_progress", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => studentsTable.id),
  conceptId: integer("concept_id").notNull().references(() => conceptsTable.id),
  masteryLevel: real("mastery_level").notNull().default(0),
  lastStudied: timestamp("last_studied"),
  studyCount: integer("study_count").notNull().default(0),
});

export const assessmentsTable = pgTable("assessments", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull().references(() => coursesTable.id),
  title: text("title").notNull(),
  questionCount: integer("question_count").notNull().default(10),
  timeLimit: integer("time_limit").notNull().default(30),
  adaptiveLevel: text("adaptive_level").notNull().default("medium"),
});

export const studentAssessmentsTable = pgTable("student_assessments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => studentsTable.id),
  assessmentId: integer("assessment_id").notNull().references(() => assessmentsTable.id),
  status: text("status").notNull().default("pending"),
  score: real("score"),
  completedAt: timestamp("completed_at"),
});

export const insertCourseSchema = createInsertSchema(coursesTable).omit({ id: true, createdAt: true, enrolledCount: true });
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof coursesTable.$inferSelect;
export type Concept = typeof conceptsTable.$inferSelect;
export type Enrollment = typeof enrollmentsTable.$inferSelect;
