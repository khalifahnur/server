"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const Admin = require("../models/admin");
const secretKey = process.env.JWT_SECRET_KEY || (0, GenerateSecretKey_1.default)();
console.log("JWT_SECRET_KEY:", secretKey ? "Loaded ✅" : "Not Found ❌"); // Debugging
const setupWebSocket = (io) => {
    io.on("connection", (socket) => __awaiter(void 0, void 0, void 0, function* () {
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
            const decoded = jsonwebtoken_1.default.verify(token, secretKey);
            const adminId = decoded.userId;
            console.log("Decoded token:", decoded);
            // Find the admin by userId and get the restaurantId
            const admin = yield Admin.findById(adminId);
            if (!admin) {
                console.error("admin not found");
            }
            const restaurantId = admin.restaurantId;
            if (!restaurantId) {
                console.log("Authentication error: Missing restaurantId in token");
                return socket.disconnect(true);
            }
            console.log(`Client authenticated for restaurant: ${restaurantId}`);
            const sendUpdates = () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const reservations = yield getTodayActiveReservation(restaurantId);
                    const revenue = yield getTotalRevenue(restaurantId);
                    const tableStatus = yield tableAvailability(restaurantId);
                    const totalCustomers = yield totalCustomer(restaurantId);
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
            });
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
    }));
};
exports.default = setupWebSocket;
