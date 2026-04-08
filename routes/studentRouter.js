import e from "express";
import { generateOtp, studentRegister, studentRegisterFromCSV } from "../controllers/studentController.js";

const studentRouter = e.Router();


studentRouter.post("/register/manual", studentRegister);
studentRouter.post("/register/bulk", studentRegisterFromCSV);
studentRouter.post("/generate-otp", generateOtp);

export default studentRouter;