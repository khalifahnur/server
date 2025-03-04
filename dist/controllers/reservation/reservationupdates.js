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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const node_cron_1 = __importDefault(require("node-cron"));
const Reservation = require("../../models/reservation");
const startReservationCronJob = () => {
    node_cron_1.default.schedule("5 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        console.log("Running reservation status update job...");
        try {
            const nowInNairobi = moment_timezone_1.default.tz("Africa/Nairobi");
            const result = yield Reservation.updateMany({
                status: "active",
                "reservationInfo.endTime": { $lte: nowInNairobi },
            }, { $set: { status: "completed" } });
            console.log(`Updated ${result.modifiedCount} reservations.`);
        }
        catch (error) {
            console.error("Error updating reservations:", error);
        }
    }));
};
module.exports = startReservationCronJob;
