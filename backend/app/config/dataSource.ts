import { BaseEntity, DataSource } from 'typeorm'
import dotenv from 'dotenv'
import { Camera } from '../entities/camera.entity';
import { Mission } from '../entities/mission.entity';
import { Radar } from '../entities/radar.entity';
import { Target } from '../entities/target.entity';
import { InitMissionDataFromFile1634567890123 } from '../migrations/InitMissionDataFromFile1634567890123';

dotenv.config()

export const AppDataSource = new DataSource({
    url: process.env.DB_URI,
    type: "postgres",
    logging: true,
    entities: [BaseEntity, Mission, Camera, Radar, Target],
    migrations: [InitMissionDataFromFile1634567890123],
    migrationsTableName: "migration",
    synchronize: true,
    ssl: false,
});