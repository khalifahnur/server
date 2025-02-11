import { Request, Response } from "express";

const Reservation = require("../../models/reservation");
const TableLayout = require("../../models/restaurantlayout");

interface reservationInfo {
  reservationID:string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  bookingDate: Date;
  bookingFor: Date;
  endTime: Date;
  guest:string;
  tableNumber: number;
  diningArea:string
}

interface RestaurantInfo { 
  restaurantId: string;
  restaurantName: string;
  image?: string;
  location?: string;
  longitude?: number;
  latitude?: number;
  rate?: number;
}

interface Reservation {
  restaurantInfo: RestaurantInfo;
  reservationInfo: reservationInfo;
  status: "active" | "cancelled" | "completed";
}

const checkAvailability = async (req: Request, res: Response) => {
  try {
    const { restaurantId, bookingFor, endTime } = req.body;

    if (!restaurantId || !bookingFor || !endTime) {
      return res
        .status(400)
        .json({ error: "restaurantId, bookingFor, and endTime are required." });
    }

    const bookingStart = new Date(bookingFor);
    const bookingEnd = new Date(endTime);

    if (bookingEnd <= bookingStart) {
      return res
        .status(400)
        .json({ error: "endTime must be after bookingFor." });
    }

    // Fetch all active reservations for the restaurant
    const activeReservations = await Reservation.find({
      "restaurantInfo.restaurantId": restaurantId,
      status: "active",
    });

    // Filter overlapping reservations
    const overlappingReservations = activeReservations.filter(
      (reservation: Reservation) => {
        const reservationStart = new Date(
          reservation.reservationInfo.bookingFor
        ).getTime();
        const reservationEnd = new Date(reservation.reservationInfo.endTime).getTime();

        return (
          bookingStart.getTime() < reservationEnd &&
          bookingEnd.getTime() > reservationStart
        );
      }
    );

    const reservedTables = overlappingReservations.map(
      (res: Reservation) => res.reservationInfo.tableNumber
    );

    const restaurantLayout = await TableLayout.findById(restaurantId)
    const tables = restaurantLayout.tablePosition.map((table: any) => table.name);
    console.log(tables)
    // Determine availability
    const availability = tables.map((tableNumber:any) => ({
      tableNumber,
      isAvailable: !reservedTables.includes(tableNumber),
    }));

    return res.status(200).json({availability,tables});
  } catch (error: any) {
    console.error("Error checking availability:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

module.exports = checkAvailability;
