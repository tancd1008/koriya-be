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
const userUrl = "/user/order";
const adminUrl = "/admin/order";

orderRouter.get(`${userUrl}/list`, listOrders);
orderRouter.post(`${userUrl}/userorders`, checkAuthorization, userOrders);
orderRouter.post(`${userUrl}/place`, checkAuthorization, placeOrder);
orderRouter.post(`${userUrl}/status`, updateStatus);
orderRouter.post(`${userUrl}/verify`, verifyOrder);
orderRouter.post(`${userUrl}/placecod`, checkAuthorization, placeOrderCod);

export default orderRouter;
