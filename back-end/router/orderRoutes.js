import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getMyOrders } from "../controler/orderController.js";

const orderRouter = express.Router();

orderRouter.get("/my-orders", verifyToken, getMyOrders);

export default orderRouter;