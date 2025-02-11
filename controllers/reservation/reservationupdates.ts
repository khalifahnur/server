import cron from "node-cron";

const Reservation = require("../../models/reservation");

const startReservationCronJob = () => {
  cron.schedule("* * * * *", async () => {
    console.log("Running reservation status update job...");
    try {
      const now = new Date();
      const result = await Reservation.updateMany(
        {
          status: "active",
          "reservationInfo.endTime": { $lte: now },
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
