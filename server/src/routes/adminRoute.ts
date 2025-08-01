import express from "express";
import { adminController } from "../controllers/adminController";


const adminRoute = express.Router();

adminRoute.get("/summary", adminController.getAdminSummary);
adminRoute.get("/metrics/business", adminController.getBusinessMetrics);
adminRoute.get("/stats/users", adminController.getUserStatistics);
adminRoute.get("/stats/orders/daily", adminController.getOrdersByDay);
adminRoute.get("/stats/orders/monthly", adminController.getOrdersByMonth);
export default adminRoute;