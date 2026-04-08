import e from "express";
import { studentRegister, studentRegisterFromCSV } from "../controllers/studentController.js";

const studentRouter = e.Router();


studentRouter.post("/register/manual", studentRegister);
studentRouter.post("/register/bulk", studentRegisterFromCSV);

export default studentRouter;