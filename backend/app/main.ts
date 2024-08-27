import "reflect-metadata";
import express from "express";
import http from "http";
import cors from "cors";
import { AppDataSource } from "./config/dataSource";


const app = express();
const server = http.createServer(app);
const port = process.env.PORT || 3000;

app.use(express.json()); // Поддержка JSON-формата
app.use(cors());

(async () => {
    await AppDataSource.initialize();
    await AppDataSource.runMigrations();
    server.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})();
