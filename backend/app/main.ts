import "reflect-metadata";
import fs from 'fs'
import express from "express";
import { Server } from 'socket.io';
import http from "http";
import cors from "cors";
import router from "./router/router";
import { GameRoomsController } from "./controllers/game-rooms.controller";
import { AppDataSource } from "./config/dataSource";
import { AuthController } from "./controllers/auth.controller";
import { ClientToServerEvents, ServerToClientEvents } from './types/sockets.model';


const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 8000;

app.use(express.json()); // Поддержка JSON-формата
app.use(cors());
app.use('/api', router);

(async () => {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();
    const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
        path: '/api/socket.io', 
        cors: {
            origin: "*", // Разрешить все домены
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Разрешенные методы
            allowedHeaders: ["*"], // Разрешенные заголовки
            credentials: true // Разрешить отправку учетных данных
        }
    });
    const authController = new AuthController()
    io.use(authController.authSocketMiddleware())

    new GameRoomsController(io);

    server.listen(port as number, () => {
        console.log(`Server is running on port ${port}`);
    });
})();
