import express from "express";

const ReserveController = require("../../controllers/reservation/reserve");
const GetUserController = require("../../controllers/reservation/getuserreservation");
const GetResController = require("../../controllers/reservation/getreservation");
const FetchActiveTables = require("../../controllers/reservation/fetchavailabletables");
const UserActiveController = require("../../controllers/reservation/userReservation/active");
const UserCompletedController = require("../../controllers/reservation/userReservation/completed");
const UserCancelledController = require("../../controllers/reservation/userReservation/cancelled");

const UserUpdateStatus = require("../../controllers/reservation/userReservation/cancelreservation");

const attachRestaurantId = require("../../middleware/attachRestaurantId");

const router = express.Router();

// Post reservation
router.post("/:userId/reserve/:restaurantId/:fcmToken", ReserveController);

router.post("/fetched-active", FetchActiveTables);

// Admin routes
router.get("/fetch-all-reservations", attachRestaurantId, GetUserController.getAllUserReservation);
router.get(
  "/:restaurantId/reservations/active",
  GetUserController.getUserActiveReservation
);
router.get(
  "/:restaurantId/reservations/cancelled",
  GetUserController.getUserCancelledReservation
);

// User routes
router.get("/:userId/completed", UserCompletedController);
router.get("/:userId/active", UserActiveController);
router.get("/:userId/cancelled", UserCancelledController);

//user manually cancellation
router.patch("/user-cancel-reservation/:userId", UserUpdateStatus);

module.exports = router;
