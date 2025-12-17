interface prop {
    restaurantId:string;
    bookingFor:Date;
    endTime:Date
}
export const GenerateReservationID = ({restaurantId, bookingFor, endTime}:prop) => {
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

