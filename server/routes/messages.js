const express = require("express");
const router = express.Router();
const Message = require("../models/Message");
const Room = require("../models/Room");
const auth = require("../middleware/auth");

// @route   GET /api/messages/:roomId
// @desc    Get all messages in a room
router.get("/:roomId", auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!room.members.includes(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You are not a member of this room" });
    }

    const messages = await Message.find({ room: req.params.roomId })
      .populate("sender", "username")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/messages
// @desc    Send a message (used for initial load, real-time uses Socket.io)
router.post("/", auth, async (req, res) => {
  try {
    const { roomId, content } = req.body;

    if (!content || !roomId) {
      return res
        .status(400)
        .json({ message: "Content and room ID are required" });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!room.members.includes(req.user._id)) {
      return res
        .status(403)
        .json({ message: "You are not a member of this room" });
    }

    const message = new Message({
      room: roomId,
      sender: req.user._id,
      content,
    });

    await message.save();
    await message.populate("sender", "username");

    res.status(201).json(message);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
