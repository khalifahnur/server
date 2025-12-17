import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import { Server } from "socket.io";
import setupWebSocket from "./sockets/socket";
import session from "express-session";
import passport from "./controllers/auth/passport/passport";
import MongoStore from "connect-mongo"
import helmet from "helmet";
import morgan from "morgan"

const startReservationCronJob = require("./controllers/reservation/reservationupdates");

dotenv.config();

const app = express();

const server = http.createServer(app);
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


const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://swiftab-web.vercel.app"],
    methods: ["GET", "POST"],
    credentials:true,
  },
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
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
  })
);


app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan("combined"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.use(bodyParser.json({ limit: "5mb" }));

app.use(passport.initialize());
app.use(passport.session());


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
const waiterrouter = require("./routes/waiter/waiterrouter");
const orderrouter = require("./routes/order/orderroute");


app.use("/swiftab/restaurant", restaurantrouter);
app.use("/swiftab/auth/admin", adminauthrouter);
app.use("/swiftab/auth/user", userauthrouter);
app.use("/swiftab/auth/waiter", waiterrouter);
app.use("/swiftab/reservation", reservationrouter);
app.use("/swiftab/table", tablerouter);
app.use("/swiftab/orders", orderrouter);

setupWebSocket(io);
app.disable('x-powered-by');
server
  .listen(port, () => {
    console.log(`Listening on port ${port}`);
  })
  .on("error", (err: Error) => {
    console.error("Server error:", err);
  });
