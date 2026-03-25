# Workspace

## Overview

pnpm workspace monorepo using TypeScript. LearnNova — an adaptive learning platform that tracks student progress, identifies knowledge gaps, and personalizes learning paths using AI.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite, Tailwind CSS, Recharts, Framer Motion, Lucide React

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── learnnova/          # LearnNova React frontend (at root /)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## LearnNova Features

- **Dashboard**: Streak tracking, XP/level system, AI learning path, upcoming reviews
- **Courses**: Filterable course catalog, enrollment, progress tracking, concept maps
- **Progress Tracking**: Memory retention graph (30 days), knowledge gap analysis, forgetting curve visualization
- **Assessments**: Adaptive quizzes with AI scoring and recommendations
- **Account**: Profile management with learning style preferences

## Database Schema

Tables:
- `students` — user profiles with XP, streaks, learning style
- `courses` — course catalog with difficulty levels
- `concepts` — learning concepts with prerequisites and positions
- `enrollments` — student-course enrollment with progress %
- `student_concept_progress` — per-concept mastery levels
- `assessments` — quiz definitions with adaptive difficulty
- `student_assessments` — quiz results per student
- `memory_graph` — historical retention data points

## API Routes

All routes under `/api`:
- `GET /students/me` — Student profile
- `PUT /students/me` — Update profile
- `GET /dashboard/stats` — Dashboard statistics
- `GET /courses` — Course list
- `GET /courses/:id` — Course detail with concepts
- `POST /courses/:id/enroll` — Enroll in course
- `GET /progress` — Overall progress summary
- `GET /progress/memory-graph` — 30-day retention history
- `GET /progress/knowledge-gaps` — AI-identified gaps
- `GET /progress/forgetting-curve` — Forgetting curve data
- `GET /progress/learning-path` — Personalized AI path
- `GET /assessments` — Assessment list
- `POST /assessments/:id/submit` — Submit quiz answers
- `GET /concepts` — Full concept relationship map

## Development Commands

- `pnpm --filter @workspace/api-server run dev` — API server dev
- `pnpm --filter @workspace/learnnova run dev` — Frontend dev
- `pnpm --filter @workspace/api-spec run codegen` — Regenerate API types
- `pnpm --filter @workspace/db run push` — Push DB schema changes
