import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getRooms, createRoom } from "../services/api";
import RoomList from "../components/RoomList";
import ChatRoom from "../components/ChatRoom";
import { initSocket, disconnectSocket } from "../services/socket";
import "../styles/Chat.css";

const Chat = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [newRoomData, setNewRoomData] = useState({ name: "", description: "" });

  const { user, logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize socket connection
    initSocket();

    // Fetch rooms
    fetchRooms();

    return () => {
      disconnectSocket();
    };
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await getRooms();
      setRooms(response.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await createRoom(newRoomData);
      setRooms([response.data, ...rooms]);
      setNewRoomData({ name: "", description: "" });
      setShowCreateRoom(false);
    } catch (error) {
      alert(error.response?.data?.message || "Error creating room");
    }
  };

  const handleLogout = () => {
    logoutUser();
    disconnectSocket();
    navigate("/");
  };

  return (
    <div className="chat-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Chat Rooms</h2>
          <button onClick={() => setShowCreateRoom(!showCreateRoom)}>
            {showCreateRoom ? "✕" : "+"}
          </button>
        </div>

        {showCreateRoom && (
          <form className="create-room-form" onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Room name"
              value={newRoomData.name}
              onChange={(e) =>
                setNewRoomData({ ...newRoomData, name: e.target.value })
              }
              required
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newRoomData.description}
              onChange={(e) =>
                setNewRoomData({ ...newRoomData, description: e.target.value })
              }
            />
            <button type="submit">Create</button>
          </form>
        )}

        <RoomList
          rooms={rooms}
          selectedRoom={selectedRoom}
          onSelectRoom={setSelectedRoom}
        />

        <div className="user-info">
          <span>👤 {user?.username}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div className="main-content">
        {selectedRoom ? (
          <ChatRoom room={selectedRoom} />
        ) : (
          <div className="no-room-selected">
            <h2>Select a room to start chatting</h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
