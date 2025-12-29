import axios from "axios";

const API_URL = "https://chat-app-backend-p9o3.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const signup = (userData) => api.post("/auth/signup", userData);
export const login = (userData) => api.post("/auth/login", userData);

// Room APIs
export const getRooms = () => api.get("/rooms");
export const createRoom = (roomData) => api.post("/rooms", roomData);
export const joinRoom = (roomId) => api.post(`/rooms/${roomId}/join`);

// Message APIs
export const getMessages = (roomId) => api.get(`/messages/${roomId}`);
export const sendMessage = (messageData) => api.post("/messages", messageData);

export default api;
