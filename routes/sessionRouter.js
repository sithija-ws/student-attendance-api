import e from "express";
import { createSession, markAttendance } from "../controllers/sessionController.js";
import { verifyToken } from "../controllers/verifyMiddleware.js";

const sessionRouter = e.Router();

sessionRouter.post("/create",verifyToken ,createSession);
sessionRouter.post("/mark-attendance", verifyToken, markAttendance);


export default sessionRouter;