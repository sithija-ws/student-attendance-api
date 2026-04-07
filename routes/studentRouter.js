import e from "express";
import { studentRegister } from "../controllers/studentController.js";

const studentRouter = e.Router();


studentRouter.post("/register/manual", studentRegister);

export default studentRouter;