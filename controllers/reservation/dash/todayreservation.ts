const reservation = require("../../../models/reservation");
const getTodayActiveReservation = async (restaurantId: string) => {
  const today = new Date().toISOString().split("T")[0];

  try {
    const reservations = await reservation.find({
      "restaurantInfo.restaurantId": restaurantId,
      "reservationInfo.bookingFor": {
        $gte: new Date(today),
        $lt: new Date(new Date(today).setDate(new Date(today).getDate() + 1)),
      },
      status: "active",
    });

    const responseData = reservations.length;

    return responseData;
  } catch (error) {
    console.error("Error retrieving todays reservation:", error);
  }
};

module.exports = getTodayActiveReservation;
