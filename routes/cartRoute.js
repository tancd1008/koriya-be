import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cartController.js";
import { checkAuthorization } from "../middleware/auth.js";

const cartRouter = express.Router();
const userUrl = "/user/cart";
const adminUrl = "/admin/cart";

cartRouter.post(`${userUrl}/get`, getCart);
cartRouter.post(`${userUrl}/add`, checkAuthorization, addToCart);
cartRouter.post(`${userUrl}/remove`, checkAuthorization, removeFromCart);

export default cartRouter;
