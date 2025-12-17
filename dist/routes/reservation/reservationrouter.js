"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const ReserveController = require("../../controllers/reservation/userReservation/reserve");
const GetUserController = require("../../controllers/reservation/getuserreservation");
const FetchActiveTables = require("../../controllers/reservation/fetchavailabletables");
const UserActiveController = require("../../controllers/reservation/userReservation/active");
const UserCompletedController = require("../../controllers/reservation/userReservation/completed");
const UserCancelledController = require("../../controllers/reservation/userReservation/cancelled");
const UserUpdateStatus = require("../../controllers/reservation/userReservation/cancelreservation");
const attachRestaurantId = require("../../middleware/attachRestaurantId");
router.post("/:userId/reserve/:restaurantId/:fcmToken", ReserveController);
router.post("/fetched-active", FetchActiveTables);
router.get("/fetch-all-reservations", attachRestaurantId, GetUserController.getAllUserReservation);
router.get("/:restaurantId/reservations/active", GetUserController.getUserActiveReservation);
router.get("/:restaurantId/reservations/cancelled", GetUserController.getUserCancelledReservation);
router.get("/:userId/completed", UserCompletedController);
router.get("/:userId/active", UserActiveController);
router.get("/:userId/cancelled", UserCancelledController);
router.patch("/user-cancel-reservation/:userId", UserUpdateStatus);
module.exports = router;
//# sourceMappingURL=reservationrouter.js.map