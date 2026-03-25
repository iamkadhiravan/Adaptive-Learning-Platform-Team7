import { Router, type IRouter } from "express";
import healthRouter from "./health";
import studentsRouter from "./students";
import dashboardRouter from "./dashboard";
import coursesRouter from "./courses";
import progressRouter from "./progress";
import assessmentsRouter from "./assessments";
import conceptsRouter from "./concepts";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/students", studentsRouter);
router.use("/dashboard", dashboardRouter);
router.use("/courses", coursesRouter);
router.use("/progress", progressRouter);
router.use("/assessments", assessmentsRouter);
router.use("/concepts", conceptsRouter);

export default router;
