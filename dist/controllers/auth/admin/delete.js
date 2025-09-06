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
const Admin = require("../../../models/admin");
const Waiter = require("../../../models/waiter");
const deleteWaiter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    const { id } = req.params;
    try {
        if (!userId) {
            return res.status(400).json({ error: "User not authenticated" });
        }
        const adminInfo = yield Admin.findById(userId);
        if (!adminInfo) {
            return res.status(404).json({ error: "Admin info not found" });
        }
        yield Waiter.findByIdAndDelete(id);
        res.json({ message: "Waiter deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting waiter:", error);
        res.status(500).json({ error: "Server error" });
    }
});
module.exports = deleteWaiter;
