import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import "./lib/SecretKeyConfig";
import "./lib/SecretKeyConfigUser";

const startReservationCronJob = require("./controllers/reservation/reservationupdates");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;
const MongodbConn = process.env.MONGODB_CONN || "";

const corsOptions = {
  origin: ["http://localhost:3000", "http://192.168.100.197:3002"],
  // origin:'*',
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

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

// Event listener for connection
app
  .listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  })
  .on("error", (err: Error) => {
    console.error("Server error:", err);
  });
