import moment from "moment-timezone";
import cron from "node-cron";

const Reservation = require("../../models/reservation");

const startReservationCronJob = () => {
  cron.schedule("5 * * * *", async () => {
    console.log("Running reservation status update job...");
    try {
      const nowInNairobi = moment.tz("Africa/Nairobi");

      const result = await Reservation.updateMany(
        {
          status: "active",
          "reservationInfo.endTime": { $lte: nowInNairobi },
        },
        { $set: { status: "completed" } }
      );
      console.log(`Updated ${result.modifiedCount} reservations.`);
    } catch (error) {
      console.error("Error updating reservations:", error);
    }
  });
};

module.exports = startReservationCronJob;
