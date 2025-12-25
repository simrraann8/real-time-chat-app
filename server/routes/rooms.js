const express = require("express");
const router = express.Router();
const Room = require("../models/Room");
const auth = require("../middleware/auth");

// @route   GET /api/rooms
// @desc    Get all rooms
router.get("/", auth, async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate("createdBy", "username")
      .sort({ createdAt: -1 });
    res.json(rooms);
  } catch (error) {
    console.error("Get rooms error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/rooms
// @desc    Create a new room
router.post("/", auth, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Room name is required" });
    }

    const existingRoom = await Room.findOne({ name });
    if (existingRoom) {
      return res.status(400).json({ message: "Room name already exists" });
    }

    const room = new Room({
      name,
      description,
      createdBy: req.user._id,
      members: [req.user._id],
    });

    await room.save();
    await room.populate("createdBy", "username");

    res.status(201).json(room);
  } catch (error) {
    console.error("Create room error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// @route   POST /api/rooms/:id/join
// @desc    Join a room
router.post("/:id/join", auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (room.members.includes(req.user._id)) {
      return res.status(400).json({ message: "Already a member of this room" });
    }

    room.members.push(req.user._id);
    await room.save();

    res.json({ message: "Joined room successfully", room });
  } catch (error) {
    console.error("Join room error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
