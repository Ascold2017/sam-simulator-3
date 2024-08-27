import "reflect-metadata";
import express from "express";
import { Server } from 'socket.io';
import http from "http";
import cors from "cors";
import { AppDataSource } from "./config/dataSource";
import { startMissionController, stopMissionController } from "./controllers/mission.controller";
import { coreInstance } from "./config/coreInstance";


const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json()); // Поддержка JSON-формата
app.use(cors());

(async () => {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('a user connected');
        
        // Подключаем обработчики событий
        startMissionController(io, socket);
        stopMissionController(io, socket);
    });

    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})();
