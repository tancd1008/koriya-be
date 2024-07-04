import express from "express";
import { RegisterNewUser } from "../controllers/accountController.js";
import {
  Login,
  loginUser,
  registerUser,
} from "../controllers/userController.js";
const userRouter = express.Router();
const userUrl = "/user/auth";
const adminUrl = "/admin/auth";

userRouter.post(`${userUrl}/register`, RegisterNewUser);
userRouter.post(`${userUrl}/login`, Login);

export default userRouter;
