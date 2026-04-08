import e from "express";
import { changePassword, generateOtp, studentRegister, studentRegisterFromCSV } from "../controllers/studentController.js";

const studentRouter = e.Router();


studentRouter.post("/register/manual", studentRegister);
studentRouter.post("/register/bulk", studentRegisterFromCSV);
studentRouter.post("/generate-otp", generateOtp);
studentRouter.post("/reset-password", changePassword);

export default studentRouter;