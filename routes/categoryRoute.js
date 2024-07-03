import express from "express";
import {
  addCategory,
  listCategory,
} from "../controllers/categoryController.js";
import { checkAuthorization } from "../middleware/auth.js";
const categoryRouter = express.Router();

//Image Storage Engine (Saving Image to uploads folder & rename it)

categoryRouter.get("/list", listCategory);
categoryRouter.post("/add", checkAuthorization, addCategory);

export default categoryRouter;
