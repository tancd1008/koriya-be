import express from "express";
import {
  AddNewCategory,
  AdminGetAllCategories,
  AdminGetCategoryById,
  DeleteCategory,
  UpdateCategory,
  UserGetAllCategory,
  UserGetCategoryById,
} from "../controllers/categoryController.js";
import {
  checkAuthorization,
  CheckUserRolePermission,
} from "../middleware/auth.js";
import { ROLE_ADMIN, ROLE_USER } from "../secure/roles.js";
const categoryRouter = express.Router();
const userUrl = "/user/category";
const adminUrl = "/admin/category";

//Image Storage Engine (Saving Image to uploads folder & rename it)

categoryRouter.post(`${adminUrl}/get-all-categories`, AdminGetAllCategories);
categoryRouter.post(
  `${adminUrl}/add-new-category`,
  checkAuthorization,
  CheckUserRolePermission(ROLE_ADMIN),
  AddNewCategory
);
categoryRouter.put(
  `${adminUrl}/delete-a-category/:id`,
  checkAuthorization,
  CheckUserRolePermission(ROLE_ADMIN),
  DeleteCategory
);
categoryRouter.put(
  `${adminUrl}/update-a-category/:id`,
  checkAuthorization,
  CheckUserRolePermission(ROLE_ADMIN),
  UpdateCategory
);
categoryRouter.get(
  `${adminUrl}/get-a-category/:id`,
  checkAuthorization,
  CheckUserRolePermission(ROLE_ADMIN),
  AdminGetCategoryById
);

// USER
categoryRouter.post(
  `${userUrl}/get-list-category`,
  checkAuthorization,
  CheckUserRolePermission(ROLE_USER),
  UserGetAllCategory
);
categoryRouter.get(
  `${userUrl}/get-a-category/:id`,
  checkAuthorization,
  CheckUserRolePermission(ROLE_USER),
  UserGetCategoryById
);

export default categoryRouter;
