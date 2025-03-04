"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserView = require("../../models/userviews");
const postRecentlyView = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { restaurantId, userId } = req.body;
    try {
        if (!restaurantId && !userId) {
            res.status(404).json({ message: "restaurantId and userId are required" });
        }
        const view = new UserView({ userId, restaurantId });
        yield view.save();
        res.status(200).json({ success: true });
    }
    catch (e) {
        console.log(e);
    }
});
module.exports = postRecentlyView;
