import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cartController.js";
import { checkAuthorization } from "../middleware/auth.js";

const cartRouter = express.Router();

cartRouter.post("/get", getCart);
cartRouter.post("/add", checkAuthorization, addToCart);
cartRouter.post("/remove", checkAuthorization, removeFromCart);

export default cartRouter;
