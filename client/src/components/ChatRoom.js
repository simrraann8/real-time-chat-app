import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback,
} from "react";
import { AuthContext } from "../context/AuthContext";
import { getMessages, joinRoom } from "../services/api";
import { getSocket } from "../services/socket";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const ChatRoom = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typingUser, setTypingUser] = useState(null);

  const { user } = useContext(AuthContext);
  const socket = getSocket();
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const loadRoom = useCallback(async () => {
    setLoading(true);
    try {
      // Join the room if not already a member
      await joinRoom(room._id);

      // Fetch messages
      const response = await getMessages(room._id);
      setMessages(response.data);

      // Join socket room
      if (socket) {
        socket.emit("join_room", room._id);
      }
    } catch (error) {
      console.error("Error loading room:", error);
    } finally {
      setLoading(false);
    }
  }, [room._id, socket]);

  useEffect(() => {
    if (room) {
      loadRoom();
    }

    return () => {
      if (socket && room) {
        socket.emit("leave_room", room._id);
      }
    };
  }, [room, socket, loadRoom]);

  useEffect(() => {
    if (!socket) return;

    // Listen for new messages
    const handleReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    // Listen for typing indicators
    const handleUserTyping = (data) => {
      setTypingUser(data.username);
    };

    const handleUserStopTyping = () => {
      setTypingUser(null);
    };

    socket.on("receive_message", handleReceiveMessage);
    socket.on("user_typing", handleUserTyping);
    socket.on("user_stop_typing", handleUserStopTyping);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
      socket.off("user_typing", handleUserTyping);
      socket.off("user_stop_typing", handleUserStopTyping);
    };
  }, [socket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSendMessage = (content) => {
    if (socket && content.trim()) {
      socket.emit("send_message", {
        roomId: room._id,
        content,
        senderId: user.id,
        senderUsername: user.username,
      });
    }
  };

  const handleTyping = () => {
    if (socket) {
      socket.emit("typing", { roomId: room._id, username: user.username });
    }
  };

  const handleStopTyping = () => {
    if (socket) {
      socket.emit("stop_typing", { roomId: room._id });
    }
  };

  if (loading) {
    return <div className="loading">Loading messages...</div>;
  }

  return (
    <div className="chat-room">
      <div className="chat-header">
        <h2>{room.name}</h2>
        {room.description && <p>{room.description}</p>}
      </div>

      <MessageList
        messages={messages}
        currentUser={user}
        messagesEndRef={messagesEndRef}
      />

      {typingUser && (
        <div className="typing-indicator">{typingUser} is typing...</div>
      )}

      <MessageInput
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        onStopTyping={handleStopTyping}
      />
    </div>
  );
};

export default ChatRoom;
