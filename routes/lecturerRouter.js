import express from "express";
import { lecturerRegister } from "../controllers/lecturerController.js";

const lecturerRouter = express.Router();

lecturerRouter.post("/register", lecturerRegister);

export default lecturerRouter;