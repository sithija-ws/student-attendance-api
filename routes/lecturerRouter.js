import express from "express";
import { generateOTPL, lecturerRegister } from "../controllers/lecturerController.js";

const lecturerRouter = express.Router();

lecturerRouter.post("/register", lecturerRegister);
lecturerRouter.post("/generate-otp", generateOTPL);

export default lecturerRouter;