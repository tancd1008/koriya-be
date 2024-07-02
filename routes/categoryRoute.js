import express from 'express';
import { addCategory, listCategory, removeCategory } from '../controllers/categoryController';
const categoryRouter = express.Router();

categoryRouter.get("/list", listCategory)
categoryRouter.post("/add", addCategory)
categoryRouter.post("/remove", removeCategory)

export default userRouter;