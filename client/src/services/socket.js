import { io } from "socket.io-client";

const SOCKET_URL = "https://chat-app-backend-p9o3.onrender.com";

let socket = null;

export const initSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL);
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
