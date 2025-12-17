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
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const startReservationCronJob = require("./controllers/reservation/reservationupdates");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.set('trust proxy', 1);
app.disable('x-powered-by');
const port = process.env.PORT || 3002;
const MongodbConn = process.env.MONGODB_CONN || "";
const corsOptions = {
    origin: [
        "http://127.0.0.1:3000",
        "https://swiftab-web.vercel.app",
        "https://78578e1782a0.ngrok-free.app"
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
};
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
app.use((0, cors_1.default)(corsOptions));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("combined"));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.urlencoded({ extended: true, limit: "5mb" }));
app.use(body_parser_1.default.json({ limit: "5mb" }));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
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
const waiterrouter = require("./routes/waiter/waiterrouter");
const orderrouter = require("./routes/order/orderroute");
app.use("/swiftab/restaurant", restaurantrouter);
app.use("/swiftab/auth/admin", adminauthrouter);
app.use("/swiftab/auth/user", userauthrouter);
app.use("/swiftab/auth/waiter", waiterrouter);
app.use("/swiftab/reservation", reservationrouter);
app.use("/swiftab/table", tablerouter);
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
//# sourceMappingURL=index.js.map