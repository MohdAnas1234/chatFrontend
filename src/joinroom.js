import { useState } from "react";
import socket from "./socket";

export default function JoinRoom({ onJoin }) {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");

  const joinRoom = () => {
    if (!username.trim() || !room.trim()) {
      alert("Enter username & room ID");
      return;
    }

    socket.emit("joinRoom", { username, room });
    onJoin(username, room);
  };

  return (
    <div className="join-container">
      <h2>Join or Create a Room</h2>
      
      <input 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        placeholder="Enter username"
      />

      <input 
        value={room} 
        onChange={(e) => setRoom(e.target.value)} 
        placeholder="Enter room ID"
      />

      <button onClick={joinRoom}>Join</button>
    </div>
  );
}
