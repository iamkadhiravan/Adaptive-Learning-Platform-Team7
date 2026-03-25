import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const studentsTable = pgTable("students", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default("Student"),
  email: text("email").notNull().unique(),
  avatar: text("avatar"),
  learningStyle: text("learning_style").notNull().default("visual"),
  streakDays: integer("streak_days").notNull().default(0),
  totalXp: integer("total_xp").notNull().default(0),
  level: integer("level").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const memoryGraphTable = pgTable("memory_graph", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").notNull().references(() => studentsTable.id),
  date: text("date").notNull(),
  retention: integer("retention").notNull().default(0),
  conceptsStudied: integer("concepts_studied").notNull().default(0),
  studyMinutes: integer("study_minutes").notNull().default(0),
});

export const insertStudentSchema = createInsertSchema(studentsTable).omit({ id: true, createdAt: true });
export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type Student = typeof studentsTable.$inferSelect;
