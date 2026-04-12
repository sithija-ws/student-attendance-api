import express from "express";
import { changePassword, generateOTPL, lecturerRegister } from "../controllers/lecturerController.js";

const lecturerRouter = express.Router();

lecturerRouter.post("/register", lecturerRegister);
lecturerRouter.post("/generate-otp", generateOTPL);
lecturerRouter.post("/reset-password", changePassword);

export default lecturerRouter;