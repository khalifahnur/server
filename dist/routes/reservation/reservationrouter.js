"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ReserveController = require("../../controllers/reservation/reserve");
const GetUserController = require("../../controllers/reservation/getuserreservation");
const GetResController = require("../../controllers/reservation/getreservation");
const FetchActiveTables = require("../../controllers/reservation/fetchavailabletables");
const UserActiveController = require("../../controllers/reservation/userReservation/active");
const UserCompletedController = require("../../controllers/reservation/userReservation/completed");
const UserCancelledController = require("../../controllers/reservation/userReservation/cancelled");
// dash
// const RevenueController = require("../../controllers/order/dash/totalrevenue");
// const TotalCustomerController = require("../../controllers/reservation/dash/totalcustomers");
// const AvailableTableController = require("../../controllers/reservation/dash/tableavailability");
// const TodayReservationController = require("../../controllers/reservation/dash/todayreservation");
const UserUpdateStatus = require("../../controllers/reservation/userReservation/cancelreservation");
const attachRestaurantId = require("../../middleware/attachRestaurantId");
const testController = require("../../controllers/test");
const router = express_1.default.Router();
router.post("/test-message", testController);
// Post reservation
router.post("/:userId/reserve/:restaurantId/:fcmToken", ReserveController);
router.post("/fetched-active", FetchActiveTables);
// Admin routes
router.get("/fetch-all-reservations", attachRestaurantId, GetUserController.getAllUserReservation);
router.get("/:restaurantId/reservations/active", GetUserController.getUserActiveReservation);
router.get("/:restaurantId/reservations/cancelled", GetUserController.getUserCancelledReservation);
// router.get(
//   "/get-revenue",
//   attachRestaurantId,
//   RevenueController
// );
// router.get(
//   "/total-customer",
//   attachRestaurantId,
//   TotalCustomerController
// );
// router.get(
//   "/available-tables",
//   attachRestaurantId,
//   AvailableTableController
// );
// router.get(
//   "/fetch-today-reservations",
//   attachRestaurantId,
//   TodayReservationController
//);
// User routes
router.get("/:userId/completed", UserCompletedController);
router.get("/:userId/active", UserActiveController);
router.get("/:userId/cancelled", UserCancelledController);
//user manually cancellation
router.patch("/user-cancel-reservation/:userId", UserUpdateStatus);
module.exports = router;
