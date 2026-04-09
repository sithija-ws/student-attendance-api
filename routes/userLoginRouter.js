import e from "express";
import { loginUser } from "../controllers/userLoginController.js";

const userLoginRouter = e.Router();

userLoginRouter.post("/", loginUser);

export default userLoginRouter;