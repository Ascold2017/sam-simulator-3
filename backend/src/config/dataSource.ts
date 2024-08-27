import { DataSource } from 'typeorm'
import dotenv from 'dotenv'

dotenv.config()

export const AppDataSource = new DataSource({
    url: process.env.DB_URI,
    type: "postgres",
    logging: true,
    entities: ['./entities/*.ts'],
    migrations: ['./migrations/*.ts'],
    migrationsTableName: "migration",
    synchronize: true,
    ssl: false,
});