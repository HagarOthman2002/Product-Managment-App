const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
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
  .catch((err) => console.error("DB connection error:", err));

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/v1/", userRouter);
app.use("/api/v1/products", productRouter);

// ✅ create HTTP server and attach Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log(" WebSocket connected:", socket.id);
app.set("io", io); //allows  to access io from req.app.get("io") inside any controller.

  socket.on("message", (data) => {
    console.log("Message from client:", data);
    socket.emit("message", { message: "Hello from server" });
  });
});


module.exports = httpServer;
