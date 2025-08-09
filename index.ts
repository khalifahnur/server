import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import setupWebSocket from "./sockets/socket";
import session from "express-session"
import passport from "./controllers/auth/passport/passport"

import "./lib/SecretKeyConfig";
import "./lib/SecretKeyConfigUser";
import "./lib/SecretKeyConfigWaiter";


const startReservationCronJob = require("./controllers/reservation/reservationupdates");

dotenv.config();

const app = express();

const server = http.createServer(app);

const port = process.env.PORT || 3002;
const MongodbConn = process.env.MONGODB_CONN || "";

const corsOptions = {
  origin: ['https://swiftab-web.vercel.app', 'http://localhost:3000'],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Set-Cookie'],
};

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://swiftab-web.vercel.app"],
    methods: ["GET", "POST"],
    credentials:true,
  },
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(cors(corsOptions));
app.use(cookieParser());

app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.use(bodyParser.json({ limit: "5mb" }));

mongoose
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

setupWebSocket(io);
// Event listener for connection
server
  .listen(port, () => {
    console.log(`Listening on port ${port}`);
  })
  .on("error", (err: Error) => {
    console.error("Server error:", err);
  });
