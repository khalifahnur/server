"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateReservationID = void 0;
const GenerateReservationID = ({ restaurantId, bookingFor, endTime }) => {
    const idSuffix = restaurantId.slice(-4).toUpperCase();
    const start = new Date(bookingFor);
    const end = new Date(endTime);
    const startHour = start.getHours().toString().padStart(2, '0');
    const startMinute = start.getMinutes().toString().padStart(2, '0');
    const endHour = end.getHours().toString().padStart(2, '0');
    const endMinute = end.getMinutes().toString().padStart(2, '0');
    // Combine into the format RSV (reservationID)
    return `RSV${startHour}${startMinute}${endHour}${endMinute}${idSuffix}`;
};
exports.GenerateReservationID = GenerateReservationID;
//# sourceMappingURL=GenerateReservationID.js.map