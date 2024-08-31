import "reflect-metadata";
import express from "express";
import { Server } from 'socket.io';
import http from "http";
import cors from "cors";
import { AppDataSource } from "./config/dataSource";
import { missionController } from "./controllers/mission.controller";
import { coreInstance } from "./config/coreInstance";


const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json()); // Поддержка JSON-формата
app.use(cors());

(async () => {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();
    const io = new Server(server, {
        cors: {
            origin: "*", // Разрешить все домены
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Разрешенные методы
    allowedHeaders: ["*"], // Разрешенные заголовки
    credentials: true // Разрешить отправку учетных данных
        }
    });

    io.on('connection', (socket) => {
        console.log('a user connected', socket);
        
        // Подключаем обработчики событий
        missionController(io, socket);
    });

    coreInstance.updateListener = () => {
        io.emit('flight_objects_update', coreInstance.getFlightObjects());
    }

    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})();
