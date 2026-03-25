import { Router, type IRouter } from "express";
import { MemoryService } from "../services/memoryServices";

const router: IRouter = Router();
const memoryService = new MemoryService(process.env.MEMBRAIN_API_KEY!);

router.get("/learning-path", async (req, res) => {
  try {
    // Auth isn’t wired here yet, so fall back to a stable default.
    const studentId = (req as any).user?.id ? String((req as any).user.id) : "1";
    const path = await memoryService.getLearningPath(studentId);
    res.json({ learningPath: path });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

router.get("/knowledge-gaps", async (req, res) => {
  try {
    const studentId = (req as any).user?.id ? String((req as any).user.id) : "1";
    const gaps = await memoryService.getKnowledgeGaps(studentId);
    res.json({ knowledgeGaps: gaps });
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : String(err) });
  }
});

export default router;