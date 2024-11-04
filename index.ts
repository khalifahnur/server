import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";

//routers
const restaurantrouter = require("./routes/restaurant/resrouter");
const adminauthrouter = require("./routes/admin/adminrouter");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const MongodbConn = process.env.MONGODB_CONN || '';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//mongo db connection

mongoose
  .connect(
    MongodbConn
  )
  .then(() => {
    console.log("MongoDB successfully connected");
  })
  .catch((error) => {
    console.log("MongoDB connection Error", error);
  });

/**
 * /swiftab/restaurant/addrestaurant/
 * /swiftab/restaurant/:id/addmenu/:menuType
 * /swiftab/restaurant/:id/deletemenu/:menuType/:itemId
 * /swiftab/restaurant/:id/updatemenu/:menuType/:itemId
 */
app.use("/swiftab/restaurant", restaurantrouter);

/**
 * /swiftab/auth/SignUp
 * /swiftab/auth/SignIn
 */
app.use("/swiftab/auth", adminauthrouter)

//event listener of connection

app
  .listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  })
  .on("error", (err: Error) => {
    console.error("Server error:", err);
  });
