/* eslint-disable no-unused-vars */
import http from 'http';
import mongoose from 'mongoose';
import { Server } from 'socket.io';
import app from './index.js';
import { handleChat } from './src/app/middlewares/handleChat.js';
import { handleSocket } from './src/app/middlewares/socketHandler.js';
import config from './src/config/index.js';



async function startServer() {
  try {
    await mongoose.connect(config.database_url);
    console.log(`🛢 Database is connected successfully`);

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
        credentials: true
      }
    });
    handleChat(io);
    handleSocket(io); 

    io.on("connection", (socket) => {
      // console.log("Socket connected:", socket.id);
    });

    server.listen(config.port, () => {
      console.log(`Application listening on port ${config.port}`);
    });
  } catch (err) {
    console.log('Failed to connect to the database');
  }
}

startServer();

