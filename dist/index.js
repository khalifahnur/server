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
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("./controllers/auth/passport/passport"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
// import "./lib/SecretKeyConfig";
// import "./lib/SecretKeyConfigUser";
// import "./lib/SecretKeyConfigWaiter";
const startReservationCronJob = require("./controllers/reservation/reservationupdates");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const port = process.env.PORT || 3002;
const MongodbConn = process.env.MONGODB_CONN || "";
app.set('trust proxy', true);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        const allowedOrigins = [
            "http://127.0.0.1:3000",
            "https://swiftab-web.vercel.app",
            "https://78578e1782a0.ngrok-free.app"
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin || true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "OPTIONS", "PUT"],
    allowedHeaders: ["Content-Type"],
}));
const io = new socket_io_1.Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://swiftab-web.vercel.app"],
        methods: ["GET", "POST"],
        credentials: true,
    },
});
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({
        mongoUrl: MongodbConn,
        collectionName: "oauthSessions",
        ttl: 24 * 60 * 60,
    }),
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
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
app.disable('x-powered-by');
server
    .listen(port, () => {
    console.log(`Listening on port ${port}`);
})
    .on("error", (err) => {
    console.error("Server error:", err);
});
