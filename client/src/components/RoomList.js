import React from "react";

const RoomList = ({ rooms, selectedRoom, onSelectRoom }) => {
  return (
    <div className="room-list">
      {rooms.length === 0 ? (
        <p className="no-rooms">No rooms available. Create one!</p>
      ) : (
        rooms.map((room) => (
          <div
            key={room._id}
            className={`room-item ${
              selectedRoom?._id === room._id ? "active" : ""
            }`}
            onClick={() => onSelectRoom(room)}
          >
            <h3>{room.name}</h3>
            {room.description && <p>{room.description}</p>}
            <span className="room-members">
              👥 {room.members.length} members
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default RoomList;
