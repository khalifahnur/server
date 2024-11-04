const express = require("express");
const router = express.Router();
const AddContoller = require('../../controllers/restaurant/addrestaurant');
const AddMenuController  = require("../../controllers/restaurant/addmenu");
const RemoveController = require("../../controllers/restaurant/removemenu");
const UpdateController = require("../../controllers/restaurant/modifyitemcost");
const authenticateUser = require('../../middleware/middleware')

router.post("/addrestaurant", authenticateUser, AddContoller);
router.post("/:id/addmenu/:menuType", AddMenuController);
router.delete("/:id/deletemenu/:menuType/:itemId",RemoveController);
router.put("/:id/updatemenu/:menuType/:itemId",UpdateController);


module.exports = router;
