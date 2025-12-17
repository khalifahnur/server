"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const node_cron_1 = __importDefault(require("node-cron"));
const Reservation = require("../../models/reservation");
const startReservationCronJob = () => {
    node_cron_1.default.schedule("5 * * * *", async () => {
        console.log("Running reservation status update job...");
        try {
            const nowInNairobi = moment_timezone_1.default.tz("Africa/Nairobi");
            const result = await Reservation.updateMany({
                status: "active",
                "reservationInfo.endTime": { $lte: nowInNairobi },
            }, { $set: { status: "completed" } });
            console.log(`Updated ${result.modifiedCount} reservations.`);
        }
        catch (error) {
            console.error("Error updating reservations:", error);
        }
    });
};
module.exports = startReservationCronJob;
//# sourceMappingURL=reservationupdates.js.map