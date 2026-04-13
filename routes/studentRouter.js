import e from "express";
import { changePassword, generateOtp, studentRegister, studentRegisterFromCSV, getStudentsByInstitution, manageStudentAction } from "../controllers/studentController.js";
import { verifyToken } from "../controllers/verifyMiddleware.js";

const studentRouter = e.Router();


studentRouter.post("/register/manual",verifyToken, studentRegister);
studentRouter.post("/register/bulk",verifyToken , studentRegisterFromCSV);
studentRouter.post("/generate-otp", generateOtp);
studentRouter.post("/reset-password", changePassword);
studentRouter.get("/manage",verifyToken, getStudentsByInstitution);
studentRouter.put("/manage",verifyToken, manageStudentAction);

export default studentRouter;