import { BaseEntity, DataSource } from 'typeorm'
import dotenv from 'dotenv'
import { Mission } from '../entities/mission.entity';
import { Target } from '../entities/target.entity';
import { InitMissionDataFromFile1634567890123 } from '../migrations/InitMissionDataFromFile1634567890123';
import { AA } from '../entities/aa.entity';

dotenv.config()

export const AppDataSource = new DataSource({
    url: process.env.DB_URI,
    type: "postgres",
    logging: true,
    entities: [BaseEntity, Mission, Target, AA],
    migrations: [InitMissionDataFromFile1634567890123],
    migrationsTableName: "migration",
    synchronize: true,
    ssl: false,
});