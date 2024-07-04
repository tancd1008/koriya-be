import express from "express";
import multer from "multer";
import {
  addFood,
  listFood,
  removeFood,
} from "../controllers/foodController.js";
import { checkAuthorization } from "../middleware/auth.js";
const foodRouter = express.Router();

//Image Storage Engine (Saving Image to uploads folder & rename it)

const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    return cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });
const userUrl = "/user/food";
const adminUrl = "/admin/food";

foodRouter.get(`${userUrl}/list`, listFood);
foodRouter.post(
  `${userUrl}/add`,
  checkAuthorization,
  upload.single("image"),
  addFood
);
foodRouter.post(`${userUrl}/remove`, checkAuthorization, removeFood);

export default foodRouter;
