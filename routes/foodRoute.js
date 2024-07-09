import express from "express";
import multer from "multer";
import {
  AddNewFood,
  AdminGetAllFoods,
  AdminGetFoodById,
  DeleteFood,
  UpdateFood,
  UserGetAllFood,
  UserGetAllFoodsByCategoryId,
  UserGetFoodById,
} from "../controllers/foodController.js";
import {
  checkAuthorization,
  CheckUserRolePermission,
} from "../middleware/auth.js";
import { ROLE_ADMIN, ROLE_USER } from "../secure/roles.js";
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

// ADMIN
foodRouter.post(`${adminUrl}/get-all-foods`, AdminGetAllFoods);
foodRouter.post(
  `${adminUrl}/add-new-food`,
  checkAuthorization,
  CheckUserRolePermission(ROLE_ADMIN),
  upload.single("image"),
  AddNewFood
);
foodRouter.put(
  `${adminUrl}/delete-a-food/:id`,
  checkAuthorization,
  CheckUserRolePermission(ROLE_ADMIN),
  DeleteFood
);
foodRouter.put(
  `${adminUrl}/update-a-food/:id`,
  checkAuthorization,
  CheckUserRolePermission(ROLE_ADMIN),
  upload.single("image"),
  UpdateFood
);
foodRouter.get(
  `${adminUrl}/get-a-food/:id`,
  checkAuthorization,
  CheckUserRolePermission(ROLE_ADMIN),
  AdminGetFoodById
);

// USER
foodRouter.get(
  `${userUrl}/get-food-by-category/:category`,
  checkAuthorization,
  CheckUserRolePermission(ROLE_USER),
  UserGetAllFoodsByCategoryId
);
foodRouter.post(
  `${userUrl}/get-list-food`,
  checkAuthorization,
  CheckUserRolePermission(ROLE_USER),
  UserGetAllFood
);
foodRouter.get(
  `${userUrl}/get-a-food/:id`,
  checkAuthorization,
  CheckUserRolePermission(ROLE_USER),
  UserGetFoodById
);

export default foodRouter;
