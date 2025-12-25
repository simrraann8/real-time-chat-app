# Real-Time Chat Application

A full-stack real-time chat application built with React.js, Node.js, Express.js, MongoDB, and Socket.io.

## Features

- 🔐 User authentication (signup/login) with JWT
- 💬 Real-time messaging using Socket.io
- 🏠 Multiple chat rooms
- 👥 User presence indicators
- ⌨️ Typing indicators
- 📱 Responsive design

## Tech Stack

**Frontend:**

- React.js
- Socket.io-client
- React Router
- Axios

**Backend:**

- Node.js
- Express.js
- Socket.io
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing

## Installation

### Prerequisites

- Node.js installed
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. Navigate to server folder:

```bash
cd server
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file with:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Start the server:

```bash
npm run dev
```

### Frontend Setup

1. Navigate to client folder:

```bash
cd client
```

2. Install dependencies:

```bash
npm install
```

3. Start the React app:

```bash
npm start
```

The app will open at `http://localhost:3000`

## Usage

1. Sign up with a new account
2. Create or join a chat room
3. Start chatting in real-time!

## Screenshots

(Add screenshots here later)

## Author

Simran Singh

- GitHub: [@simrrann8](https://github.com/simrrann8)
- LinkedIn: [simran8singh](https://linkedin.com/in/simran8singh)

## License

This project is open source and available under the MIT License.
