import "reflect-metadata";
import fs from 'fs'
import express from "express";
import { Server } from 'socket.io';
import https from "https";
import cors from "cors";
import { AppDataSource } from "./config/dataSource";;
import { GameRoomManager } from "./services/gameRoomManager";
import { ClientToServerEvents, ServerToClientEvents } from "../../shared/models/sockets.model";


const app = express();
const server = https.createServer({
    key: fs.readFileSync(__dirname + '/../../shared/cert.key'),
    cert: fs.readFileSync(__dirname + '/../../shared/cert.crt')
}, app);
const port = process.env.PORT || 3000;

app.use(express.json()); // Поддержка JSON-формата
app.use(cors());

(async () => {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();
    const io = new Server<ClientToServerEvents, ServerToClientEvents>(server, {
        cors: {
            origin: "*", // Разрешить все домены
            methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Разрешенные методы
            allowedHeaders: ["*"], // Разрешенные заголовки
            credentials: true // Разрешить отправку учетных данных
        }
    });

    const gameRoomManager = new GameRoomManager(io);
    io.on('connection', (socket) => {
        // Список комнат
        gameRoomManager.getMissionRooms(socket)

        // Создать комнату
        socket.on('create_mission_room', (missionId) => {
            gameRoomManager.createRoom(missionId);
        });

        // Присоединиться к комнате
        socket.on('join_mission_room', (missionId) => {
            gameRoomManager.joinRoom(socket, missionId);
        });

        // Удалить комнату
        socket.on('delete_mission_room', (missionId) => {
            gameRoomManager.deleteRoom(missionId);
        });

        socket.on('leave_mission_room', (missionId) => {
            gameRoomManager.leaveRoom(socket, missionId)
        })

        // Отключение пользователя
        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})();
