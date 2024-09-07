import "reflect-metadata";
import fs from 'fs'
import express from "express";
import { Server } from 'socket.io';
import https from "https";
import cors from "cors";
import router from "./router/router";
import { GameRoomsController } from "./controllers/game-rooms.controller";
import { AppDataSource } from "./config/dataSource";
import { AuthController } from "./controllers/auth.controller";
import { ClientToServerEvents, ServerToClientEvents } from "@shared/models/sockets.model";


const app = express();
const server = https.createServer({
    key: fs.readFileSync(__dirname + '/../../shared/cert.key'),
    cert: fs.readFileSync(__dirname + '/../../shared/cert.crt')
}, app);
const port = process.env.PORT || 3000;

app.use(express.json()); // Поддержка JSON-формата
app.use(cors());
app.use(router);

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
    const authController = new AuthController()
    io.use(authController.authSocketMiddleware())

    new GameRoomsController(io);

    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})();
