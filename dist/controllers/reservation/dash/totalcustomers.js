"use strict";
const Reservations = require("../../../models/reservation");
const getTotalCustomers = async (restaurantId) => {
    try {
        const totalCustomers = await Reservations.find({
            "restaurantInfo.restaurantId": restaurantId,
        });
        const responseData = totalCustomers.length;
        return responseData;
    }
    catch (error) {
        console.error("Error retrieving todays reservation:", error);
    }
};
module.exports = getTotalCustomers;
//# sourceMappingURL=totalcustomers.js.map