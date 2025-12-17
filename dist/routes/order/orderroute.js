"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const CreateOrder = require("../../controllers/order/user/createOrder");
const FetchOrders = require("../../controllers/order/dash/fetchorders");
const getUserOrders = require("../../controllers/order/user/getUsersOrders");
const FetchUserOrder = require("../../controllers/order/waiter/getUserOrders");
const OrderStatus = require("../../controllers/order/waiter/updateOrderStatus");
const CompleteUserOrder = require("../../controllers/order/waiter/completeOrder");
const CompleteOrder = require("../../controllers/order/user/completeOrder");
const attachRestaurantId = require("../../middleware/attachRestaurantId");
router.get("/restaurant/fetch-all-orders", attachRestaurantId, FetchOrders);
router.post("/user/create-order", CreateOrder);
router.get("/user/:userId", getUserOrders);
router.patch('/user/complete-order/:orderId', CompleteOrder);
router.get('/waiter/dashboard/:restaurantId', FetchUserOrder);
router.patch('/waiter/status/:orderId', OrderStatus);
router.patch('/waiter/complete-order/:orderId', CompleteUserOrder);
module.exports = router;
//# sourceMappingURL=orderroute.js.map