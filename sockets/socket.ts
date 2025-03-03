import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import GenerateSecretKey from '../lib/GenerateSecretKey';

const getTotalRevenue = require("../controllers/order/dash/totalrevenue");
const getTodayActiveReservation = require("../controllers/reservation/dash/todayreservation");
const tableAvailability = require("../controllers/reservation/dash/tableavailability");
const totalCustomer = require("../controllers/reservation/dash/totalcustomers");

const Admin = require("../models/admin");

const secretKey = process.env.JWT_SECRET_KEY || GenerateSecretKey();
console.log("JWT_SECRET_KEY:", secretKey ? "Loaded ✅" : "Not Found ❌"); // Debugging

const setupWebSocket = (io: Server) => {
  io.on("connection", async (socket) => {
    console.log("New client connected:", socket.id);
    
    try {
      // ✅ Read cookies from handshake headers
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      console.log("Cookies received:", cookies);

      const token = cookies.token;
      if (!token) {
        console.log("Authentication error: No token provided");
        return socket.disconnect(true);
      }

      console.log("Token received:", token ? `${token.substring(0, 10)}...` : "none");

      // ✅ Verify JWT
      const decoded = jwt.verify(token, secretKey) as jwt.JwtPayload;
      const adminId = decoded.userId;

      console.log("Decoded token:", decoded);
      // Find the admin by userId and get the restaurantId
      const admin = await Admin.findById(adminId);
      if (!admin) {
        console.error("admin not found")
      }

      const restaurantId = admin.restaurantId;
      if (!restaurantId) {
        console.log("Authentication error: Missing restaurantId in token");
        return socket.disconnect(true);
      }

      console.log(`Client authenticated for restaurant: ${restaurantId}`);

      const sendUpdates = async () => {
        try {
          const reservations = await getTodayActiveReservation(restaurantId);
          const revenue = await getTotalRevenue(restaurantId);
          const tableStatus = await tableAvailability(restaurantId);
          const totalCustomers = await totalCustomer(restaurantId);

          socket.emit("realTimeData", {
            reservations,
            revenue,
            tableStatus,
            totalCustomers,
          });
        } catch (error) {
          console.error("Error sending real-time updates:", error);
        }
      };

      sendUpdates();

      const interval = setInterval(sendUpdates, 10000);

      socket.on("disconnect", () => {
        console.log(`Client disconnected from restaurant: ${restaurantId}`);
        clearInterval(interval);
      });

    } catch (error: any) {
      console.error("JWT verification failed:", error.message);
      socket.disconnect(true);
    }
  });
};

export default setupWebSocket;
