import express from 'express';
import { addCategory, listCategory } from '../controllers/categoryController.js';
const categoryRouter = express.Router();

//Image Storage Engine (Saving Image to uploads folder & rename it)




categoryRouter.get("/list", listCategory);
categoryRouter.post("/add", addCategory);


export default categoryRouter;