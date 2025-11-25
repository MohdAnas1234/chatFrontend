// src/socket.js
import { io } from "socket.io-client";

const SOCKET_URL =  "https://chatkaro-vfs3.onrender.com" || "http://localhost:5000";; // matches server above
const socket = io(SOCKET_URL, {
  autoConnect: true,
});

export default socket;
