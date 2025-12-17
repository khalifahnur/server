"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = __importDefault(require("cookie"));
const GenerateSecretKey_1 = __importDefault(require("../lib/GenerateSecretKey"));
const getTotalRevenue = require("../controllers/order/dash/totalrevenue");
const getTodayActiveReservation = require("../controllers/reservation/dash/todayreservation");
const tableAvailability = require("../controllers/reservation/dash/tableavailability");
const totalCustomer = require("../controllers/reservation/dash/totalcustomers");
const ioredis_1 = __importDefault(require("ioredis"));
const Admin = require("../models/admin");
const redis = new ioredis_1.default();
const SECRET_KEY_REDIS_KEY = "jwt_secret_key";
// Function to get the secret key from Redis (or generate if missing)
const getSecretKey = async () => {
    let secretKey = await redis.get(SECRET_KEY_REDIS_KEY);
    if (!secretKey) {
        secretKey = (0, GenerateSecretKey_1.default)();
        await redis.set(SECRET_KEY_REDIS_KEY, secretKey);
    }
    return secretKey;
};
const setupWebSocket = (io) => {
    io.on("connection", async (socket) => {
        console.log("New client connected:", socket.id);
        try {
            // ✅ Read cookies from handshake headers
            const cookies = cookie_1.default.parse(socket.handshake.headers.cookie || "");
            console.log("Cookies received:", cookies);
            const token = cookies.token;
            if (!token) {
                console.log("Authentication error: No token provided");
                return socket.disconnect(true);
            }
            console.log("Token received:", token ? `${token.substring(0, 10)}...` : "none");
            // ✅ Verify JWT
            const secretKey = await getSecretKey();
            const decoded = jsonwebtoken_1.default.verify(token, secretKey);
            const adminId = decoded.userId;
            console.log("Decoded token:", decoded);
            // Find the admin by userId and get the restaurantId
            const admin = await Admin.findById(adminId);
            if (!admin) {
                console.error("admin not found");
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
                }
                catch (error) {
                    console.error("Error sending real-time updates:", error);
                }
            };
            sendUpdates();
            const interval = setInterval(sendUpdates, 10000);
            socket.on("disconnect", () => {
                console.log(`Client disconnected from restaurant: ${restaurantId}`);
                clearInterval(interval);
            });
        }
        catch (error) {
            console.error("JWT verification failed:", error.message);
            socket.disconnect(true);
        }
    });
};
exports.default = setupWebSocket;
//# sourceMappingURL=socket.js.map