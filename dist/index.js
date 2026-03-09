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
//import passport from "./controllers/auth/passport/passport";
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const connect_redis_1 = require("connect-redis");
const redis_1 = require("redis");
const restaurantrouter = require("./routes/restaurant/resrouter");
const adminauthrouter = require("./routes/admin/adminrouter");
const userauthrouter = require("./routes/user/userrouter");
const reservationrouter = require("./routes/reservation/reservationrouter");
const tablerouter = require("./routes/table/tablerouter");
const waiterrouter = require("./routes/waiter/waiterrouter");
const orderrouter = require("./routes/order/orderroute");
const startReservationCronJob = require("./controllers/reservation/reservationupdates");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.set("trust proxy", 1);
app.disable("x-powered-by");
const port = process.env.PORT || 3002;
const MongodbConn = process.env.MONGODB_CONN || "";
const corsOptions = {
    origin: [
        "http://localhost:3000",
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
mongoose_1.default
    .connect(MongodbConn, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
    retryWrites: true,
    retryReads: true,
})
    .then(() => {
    // startCronJob();
    console.log("MongoDB successfully connected");
})
    .catch((error) => {
    console.log("MongoDB connection Error", error);
    process.exit(1);
});
const redisClient = (0, redis_1.createClient)({
    //url: process.env.REDIS_URL ,
    url: "redis://localhost:6379",
});
redisClient.on("error", (err) => console.warn("Redis Client Error", err));
redisClient.connect();
app.use((0, express_session_1.default)({
    store: new connect_redis_1.RedisStore({ client: redisClient }),
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: false,
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
//app.use(passport.initialize());
//app.use(passport.session());
// mongoose
//   .connect(MongodbConn)
//   .then(() => {
//     startReservationCronJob();
//     console.log("MongoDB successfully connected");
//   })
//   .catch((error) => {
//     console.log("MongoDB connection Error", error);
//   });
app.use("/swiftab/restaurant", restaurantrouter);
app.use("/swiftab/auth/admin", adminauthrouter);
app.use("/swiftab/auth/user", userauthrouter);
app.use("/swiftab/auth/waiter", waiterrouter);
app.use("/swiftab/reservation", reservationrouter);
app.use("/swiftab/table", tablerouter);
app.use("/swiftab/orders", orderrouter);
(0, socket_1.default)(io);
app.disable("x-powered-by");
server
    .listen(port, () => {
    console.log(`Listening on port ${port}`);
})
    .on("error", (err) => {
    console.error("Server error:", err);
});
//# sourceMappingURL=index.js.map