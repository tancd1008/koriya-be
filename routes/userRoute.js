import express from "express";
import { RegisterNewUser } from "../controllers/accountController.js";
import {
  Login,
  loginUser,
  registerUser,
} from "../controllers/userController.js";
const userRouter = express.Router();

userRouter.post("/register", RegisterNewUser);
userRouter.post("/login", Login);

export default userRouter;
