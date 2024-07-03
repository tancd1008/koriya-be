import express from "express";
import {
  listOrders,
  placeOrder,
  placeOrderCod,
  updateStatus,
  userOrders,
  verifyOrder,
} from "../controllers/orderController.js";
import { checkAuthorization } from "../middleware/auth.js";

const orderRouter = express.Router();

orderRouter.get("/list", listOrders);
orderRouter.post("/userorders", checkAuthorization, userOrders);
orderRouter.post("/place", checkAuthorization, placeOrder);
orderRouter.post("/status", updateStatus);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/placecod", checkAuthorization, placeOrderCod);

export default orderRouter;
