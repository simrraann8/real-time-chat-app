import React from "react";

const MessageList = ({ messages, currentUser, messagesEndRef }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="no-messages">
          No messages yet. Start the conversation!
        </div>
      ) : (
        messages.map((message) => {
          const isOwnMessage = message.sender._id === currentUser.id;
          return (
            <div
              key={message._id}
              className={`message ${
                isOwnMessage ? "own-message" : "other-message"
              }`}
            >
              {!isOwnMessage && (
                <span className="message-sender">
                  {message.sender.username}
                </span>
              )}
              <div className="message-content">{message.content}</div>
              <span className="message-time">
                {formatTime(message.createdAt)}
              </span>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
