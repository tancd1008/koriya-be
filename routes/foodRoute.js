import express from 'express';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';
import multer from 'multer';
import { checkAuthorization } from '../middleware/auth.js';
const foodRouter = express.Router();

//Image Storage Engine (Saving Image to uploads folder & rename it)

const storage = multer.diskStorage({
    destination: 'uploads',
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}${file.originalname}`);
    }
})

const upload = multer({ storage: storage })

foodRouter.get("/list", listFood);
foodRouter.post("/add",checkAuthorization, upload.single('image'), addFood);
foodRouter.post("/remove",checkAuthorization, removeFood);

export default foodRouter;