const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const roomRoutes = require("./routes/rooms");
const messageRoutes = require("./routes/messages");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/messages", messageRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/chatapp")
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Basic route
app.get("/", (req, res) => {
  res.send("Chat API is running");
});

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a room
  socket.on("join_room", (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room: ${roomId}`);
    socket.to(roomId).emit("user_joined", { socketId: socket.id });
  });

  // Leave a room
  socket.on("leave_room", (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.id} left room: ${roomId}`);
    socket.to(roomId).emit("user_left", { socketId: socket.id });
  });

  // Send message
  socket.on("send_message", async (data) => {
    try {
      const { roomId, content, senderId, senderUsername } = data;

      // Save message to database
      const Message = require("./models/Message");
      const message = new Message({
        room: roomId,
        sender: senderId,
        content,
      });
      await message.save();

      // Emit to all users in the room
      io.to(roomId).emit("receive_message", {
        _id: message._id,
        content: message.content,
        sender: {
          _id: senderId,
          username: senderUsername,
        },
        createdAt: message.createdAt,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  // Typing indicator
  socket.on("typing", (data) => {
    socket.to(data.roomId).emit("user_typing", {
      username: data.username,
    });
  });

  socket.on("stop_typing", (data) => {
    socket.to(data.roomId).emit("user_stop_typing");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
