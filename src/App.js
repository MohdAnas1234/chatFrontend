// src/App.js
import React, { useEffect, useState, useRef } from "react";
import socket from "./socket";
import "./App.css";

function App() {
  const [room, setRoom] = useState("");
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);

  // SOCKET LISTENERS
  useEffect(() => {
    socket.on("chat message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("user connected", (msg) => {
      setMessages((prev) => [
        ...prev,
        { username: "System", message: msg, system: true },
      ]);
    });

    socket.on("user disconnected", (msg) => {
      setMessages((prev) => [
        ...prev,
        { username: "System", message: msg, system: true },
      ]);
    });

    socket.on("userList", (list) => {
      setUsers(list || []);
    });

    return () => {
      socket.off("chat message");
      socket.off("user connected");
      socket.off("user disconnected");
      socket.off("userList");
    };
  }, []);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // JOIN ROOM HANDLER
  const handleJoin = () => {
    if (!username.trim()) return alert("Enter username");
    if (!room.trim()) return alert("Enter room name");

    socket.emit("joinRoom", { username, room });
    setJoined(true);
  };

  // SEND MESSAGE
  const handleSend = () => {
    const text = message.trim();
    if (!text) return;

   socket.emit("chat message", {
  username,
  message: text,
  room,
});

    setMessage("");
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <>
      {/* FIRST PAGE → JOIN / CREATE ROOM */}
      {!joined && (
        <div className="room-page">

          <div className="room-card">
            <h1>💬 Chat Rooms</h1>

            <input
              className="room-input"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              className="room-input"
              type="text"
              placeholder="Room name (example: myroom123)"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
            />

            <div className="room-buttons">
              <button className="join-btn" onClick={handleJoin}>
                Join Room
              </button>

              <button
                className="create-btn"
                onClick={() => {
                  if (!username.trim()) return alert("Enter username");
                  if (!room.trim()) return alert("Enter room name");

                  socket.emit("createRoom", { username, room });
                  setJoined(true);
                }}
              >
                Create Room
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHAT PAGE */}
      {joined && (
        <div className="chat-container">
          {/* SIDEBAR */}
          <div className="sidebar">
            <h3>Users in Room</h3>

            <div className="current-user">
              You: <strong>{username}</strong>
            </div>

            <ul className="user-list">
              {users.length === 0 && <li>No users yet</li>}
              {users.map((u, i) => (
                <li key={i} className={u === username ? "me" : ""}>
                  {u}
                </li>
              ))}
            </ul>
          </div>

          {/* CHAT AREA */}
          <div className="chat-area">
            <div className="messages">
              {messages.map((m, idx) => {
                if (m.system)
                  return (
                    <div key={idx} className="system-msg">
                      {m.message}
                    </div>
                  );

                const isMe = m.username === username;

                return (
                  <div
                    key={idx}
                    className={`message-row ${isMe ? "right" : "left"}`}
                  >
                    {!isMe && <div className="msg-sender">{m.username}</div>}
                    <div className="msg-bubble">{m.message}</div>
                    {isMe && <div className="msg-sender me">You</div>}
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            <div className="input-area">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type a message..."
              />
              <button onClick={handleSend} disabled={!message.trim()}>
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
