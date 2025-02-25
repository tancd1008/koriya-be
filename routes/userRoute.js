import express from "express";
import { CreateNewAccount } from "../controllers/accountController.js";
import {
  Login,
  LoginAdmin,
  RegisterUser,
} from "../controllers/userController.js";
const userRouter = express.Router();
const userUrl = "/user/auth";
const adminUrl = "/admin/auth";

//ADMIN
userRouter.post(`${adminUrl}/create-new-account`, CreateNewAccount);
userRouter.post(`${adminUrl}/login`, LoginAdmin);
// USER
userRouter.post(`${userUrl}/register`, RegisterUser);
userRouter.post(`${userUrl}/login`, Login);

export default userRouter;
