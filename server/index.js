require("dotenv").config();

const express = require("express");
const cors = require("cors");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");
const { setIO } = require("./socket");
const { authenticate } = require("./middleware/authenticate");
require("./config/db");

const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const kitchenRoutes = require("./routes/kitchenRoutes");
const statusRoutes = require("./routes/statusRoutes");
const billingRoutes = require("./routes/billingRoutes");
const hotelRoutes = require("./routes/hotelRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);
app.use("/api", authenticate);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/kitchen", kitchenRoutes);
app.use("/api/status", statusRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/hotel", hotelRoutes);

app.get("/", (req, res) => {
  res.send("Hotel POS Backend Running");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

setIO(io);

io.on("connection", (socket) => {
  console.log("Kitchen/Reception connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
