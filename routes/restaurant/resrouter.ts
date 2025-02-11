import upload from "../../middleware/upload";

const express = require("express");
const router = express.Router();

const AddContoller = require("../../controllers/restaurant/addrestaurant");
const AddMenuController = require("../../controllers/restaurant/addmenu");
const RemoveController = require("../../controllers/restaurant/removemenu");
const authenticateUser = require("../../middleware/middleware");
const attachRestaurantId = require("../../middleware/attachRestaurantId");
const UpdateController = require("../../controllers/restaurant/editmenu");
const getMenu = require("../../controllers/restaurant/getmenurestaurant");

const FetchAllRestaurants = require("../../controllers/restaurant/fetchrestaurants");
const FetchResNearMe = require("../../controllers/restaurant/fetchresnearme");


router.post("/addrestaurant", authenticateUser,upload.single("image"), AddContoller);

router.post("/addmenu/:menuType", attachRestaurantId, upload.single("image"), AddMenuController);
router.delete("/deletemenu/:menuType/:itemId", attachRestaurantId, RemoveController);
router.put("/updatemenu/:menuType/:itemId", attachRestaurantId, UpdateController);
router.get("/menu",attachRestaurantId,getMenu);

router.get("/fetch-all-restaurants",FetchAllRestaurants);
router.post("/fetch-restaurants-near-me",FetchResNearMe);

module.exports = router;
