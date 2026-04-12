import e from "express";
import { createSession, checkSession, markAttendance, sessionList} from "../controllers/sessionController.js";
import { verifyToken } from "../controllers/verifyMiddleware.js";

const sessionRouter = e.Router();

sessionRouter.post("/create",verifyToken ,createSession);
sessionRouter.get("/check/:otp", checkSession); 
sessionRouter.post("/mark-attendance", verifyToken, markAttendance);
sessionRouter.get("/", verifyToken, sessionList);


export default sessionRouter;