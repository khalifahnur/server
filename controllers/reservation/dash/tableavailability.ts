const Reservation = require("../../../models/reservation");
const TableLayout = require("../../../models/restaurantlayout");


const tableAvailability = async (restaurantId:string) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // Fetch today's active reservations for the restaurant
    const activeReservations = await Reservation.countDocuments({
      "restaurantInfo.restaurantId": restaurantId,
      "reservationInfo.bookingFor": {
        $gte: new Date(today),
        $lt: new Date(new Date(today).setDate(new Date(today).getDate() + 1)),
      },
      status: "active",
    });

    //fetch all the total tables for that restaurant
    const totalTable = await TableLayout.findOne({
      restaurantId: restaurantId,
    });

    const totalTables = totalTable.tablePosition.length;

    //calculate remained active table
    const activeTables = totalTables.length - activeReservations;

    return {totalTables,activeTables}
  } catch (error: any) {
    console.error("Error checking availability:", error);
    
  }
};

module.exports = tableAvailability;
