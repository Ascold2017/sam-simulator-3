import "reflect-metadata";
import fs from 'fs'
import express from "express";
import { Server } from 'socket.io';
import https from "https";
import cors from "cors";
import { AppDataSource } from "./config/dataSource";
import { missionController } from "./controllers/mission.controller";
import { coreInstance } from "./config/coreInstance";
import { gameController } from "./controllers/game.controller";


const app = express();
const server = https.createServer( {
    key: fs.readFileSync(__dirname + '/../../shared/cert.key'),
    cert: fs.readFileSync(__dirname +  '/../../shared/cert.crt')
}, app);
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
        console.log('a user connected');

        // Подключаем обработчики событий
        missionController(io, socket);
        gameController(io, socket)
    });

    coreInstance.updateListener = () => {
        io.emit('flight_objects_update', coreInstance.getFlightObjects());
    }

    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})();
