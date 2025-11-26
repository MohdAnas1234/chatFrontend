// src/socket.js

import { io } from "socket.io-client";

// Define the URLs
const PRODUCTION_URL = "https://chatkaro-vfs3.onrender.com";
const DEVELOPMENT_URL = "http://localhost:5000";

// Use the environment variable to choose the URL
const SOCKET_URL = 
  process.env.NODE_ENV === 'production' 
    ? PRODUCTION_URL 
    : DEVELOPMENT_URL;

const socket = io(SOCKET_URL, {
  autoConnect: true,
});

console.log("Connecting to:", SOCKET_URL); // Useful for debugging

export default socket;