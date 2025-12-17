"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const TableController = require("../../controllers/table/savetables");
const RestaurantInfoController = require("../../controllers/table/fetchlayoutinfo");
const SaveLayoutInfo = require("../../controllers/table/savelayoutinfo");
const RestaurantTablesController = require("../../controllers/table/fetchtables");
const RestaurantTableController = require("../../controllers/table/fetchrestable");
const attachRestaurantId = require("../../middleware/attachRestaurantId");
router.post("/save-tables", attachRestaurantId, TableController);
router.get("/fetch-restaurant-info", attachRestaurantId, RestaurantInfoController);
router.post("/save-layout-info", attachRestaurantId, SaveLayoutInfo);
router.get("/fetch-restaurant-tables", attachRestaurantId, RestaurantTablesController);
//mobile
router.get("/fetch-restaurant-table/:restaurantId", RestaurantTableController);
module.exports = router;
//# sourceMappingURL=tablerouter.js.map