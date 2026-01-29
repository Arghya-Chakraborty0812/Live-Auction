import { io } from "socket.io-client";

// Connect to backend Socket.IO server
const socket = io("https://live-auction-6i7e.onrender.com/api/items", {
  transports: ["websocket"], // avoid polling issues
});

export default socket;
