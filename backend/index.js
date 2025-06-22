const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");

dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB)
  .then(() => console.log("DB connection successful!"))
  .catch((err) => console.error(" DB connection error:", err));



const app = express();
const cors = require("cors");

const jwt = require("jsonwebtoken");

app.use("/uploads", express.static("uploads"));
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/v1/", userRouter);
app.use("/api/v1/products", productRouter);

module.exports = app;
