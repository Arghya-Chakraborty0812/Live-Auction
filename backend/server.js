import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import itemRoutes from "./routes/itemRoutes.js";
import { placeBid } from "./models/itemModel.js";

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// REST API
app.use("/api", itemRoutes);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on("connection", socket => {
  console.log("🟢 User connected:", socket.id);

  socket.on("BID_PLACED", ({ itemId, bidAmount }) => {
    console.log("📩 Bid received:", itemId, bidAmount, socket.id);

    const result = placeBid(itemId, bidAmount, socket.id);

    if (!result.success) {
      socket.emit("BID_ERROR", result.message);
      return;
    }

    // ✅ broadcast updated item to ALL users
    io.emit("UPDATE_BID", result.item);
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
