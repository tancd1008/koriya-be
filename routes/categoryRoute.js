import express from "express";
import {
  addCategory,
  listCategory,
} from "../controllers/categoryController.js";
import { checkAuthorization } from "../middleware/auth.js";
const categoryRouter = express.Router();
const userUrl = "/user/category";
const adminUrl = "/admin/category";

//Image Storage Engine (Saving Image to uploads folder & rename it)

categoryRouter.get(`${userUrl}/list`, listCategory);
categoryRouter.post(`${userUrl}/add`, checkAuthorization, addCategory);

export default categoryRouter;
