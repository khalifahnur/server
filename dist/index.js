"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const socket_1 = __importDefault(require("./sockets/socket"));
require("./lib/SecretKeyConfig");
require("./lib/SecretKeyConfigUser");
const startReservationCronJob = require("./controllers/reservation/reservationupdates");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://192.168.100.197:3002"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});
const port = process.env.PORT || 3003;
const MongodbConn = process.env.MONGODB_CONN || "";
const corsOptions = {
    origin: ["http://localhost:3000", "http://192.168.100.197:3002"],
    // origin:'*',
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true, limit: "5mb" }));
app.use(body_parser_1.default.json({ limit: "5mb" }));
mongoose_1.default
    .connect(MongodbConn)
    .then(() => {
    startReservationCronJob();
    console.log("MongoDB successfully connected");
})
    .catch((error) => {
    console.log("MongoDB connection Error", error);
});
const restaurantrouter = require("./routes/restaurant/resrouter");
const adminauthrouter = require("./routes/admin/adminrouter");
const userauthrouter = require("./routes/user/userrouter");
const reservationrouter = require("./routes/reservation/reservationrouter");
const tablerouter = require("./routes/table/tablerouter");
const paymentrouter = require("./routes/payment/paymentrouter");
const waiterrouter = require("./routes/waiter/waiterrouter");
const orderrouter = require("./routes/order/orderroute");
/**
 * /swiftab/restaurant/addrestaurant/
 * /swiftab/restaurant/addmenu/:menuType
 * /swiftab/restaurant/deletemenu/:menuType/:itemId
 * /swiftab/restaurant/updatemenu/:menuType/:itemId
 * /swiftab/restaurant/menu
 * /swiftab/restaurant/fetch-restaurants-near-me
 * /swiftab/restaurant/fetch-restaurant-table
 *
 */
app.use("/swiftab/restaurant", restaurantrouter);
/**
 * /swiftab/auth/admin/SignUp
 * /swiftab/auth/admin/SignIn
 * /swiftab/auth/admin/fetchinfo
 * /swiftab/auth/admin/logout
 */
app.use("/swiftab/auth/admin", adminauthrouter);
/**
 * /swiftab/auth/user/SignUp
 * /swiftab/auth/user/SignIn
 */
app.use("/swiftab/auth/user", userauthrouter);
/**
 * /swiftab/auth/waiter/waiter-signup
 * /swiftab/auth/waiter/waiter-app-signin
 * /swiftab/auth/waiter/waiter-new-password
 */
app.use("/swiftab/auth/waiter", waiterrouter);
/**
 * /swiftab/reservation/:userId/reserve/:restaurantId
 * /swiftab/reservation/:restaurantId
 * /swiftab/reservation/:userId/active |cancelled | completed
 * /swiftab/reservation/fetched-active
 */
app.use("/swiftab/reservation", reservationrouter);
/**
 * /swiftab/table/save-tables
 * /swiftab/table/fetch-tables
 * /swiftab/table/fetch-restaurant-info
 * /swiftab/table/save-layout-info
 * /swiftab/table/fetch-restaurant-tables
 * /swiftab/table/fetch-restaurant-table/:restaurantId
 */
app.use("/swiftab/table", tablerouter);
/**
 * /swiftab/payment/initiate-payment
 * /swiftab/payment/transfer-payment
 */
app.use("/swiftab/payment", paymentrouter);
/**
 * /swiftab/orders/take-order-route
 * /swiftab/orders/fetch-all-order/:restaurantId
 * /swiftab/orders/fetch-served-order/:restaurantId
 * /swiftab/orders/fetch-not-served-order/:restaurantId
 * /swiftab/orders/fetch-paid-order/:restaurantId
 * /swiftab/orders/fetch-un-paid-order/:restaurantId
 * /swiftab/orders/fetch-latest-order/:restaurantId
 */
app.use("/swiftab/orders", orderrouter);
(0, socket_1.default)(io);
// Event listener for connection
server
    .listen(port, () => {
    console.log(`Listening on port ${port}`);
})
    .on("error", (err) => {
    console.error("Server error:", err);
});
