import { io } from "socket.io-client";

// Connect to backend Socket.IO server
const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket"], // avoid polling issues
});

export default socket;
