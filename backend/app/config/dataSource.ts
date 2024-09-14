import { BaseEntity, DataSource } from 'typeorm'
import dotenv from 'dotenv'
import { Mission } from '../entities/mission.entity';
import { MissionTarget } from '../entities/missionTarget.entity';
import { AA } from '../entities/aa.entity';
import { User } from '../entities/user.entity';
import { Target } from '../entities/target.entity';
import { MissionMap } from '../entities/missionMap.entity';
import { MissionAAPosition } from '../entities/missionAAPosition';

dotenv.config()

const isDev = process.env.TS_NODE_DEV === 'true'
export const AppDataSource = new DataSource({
    url:isDev ? process.env.DB_URI_LOCAL : process.env.DB_URI,
    type: "postgres",
    logging: true,
    entities: [BaseEntity, Mission, MissionTarget, MissionAAPosition, MissionMap, AA, Target, User],
    synchronize: isDev,
    ssl: false,
});

export const DI = {
    missionRepository: AppDataSource.getRepository(Mission),
    userRepository: AppDataSource.getRepository(User),
    aaRepository: AppDataSource.getRepository(AA),
    targetRepository: AppDataSource.getRepository(Target),
    mapRepository: AppDataSource.getRepository(MissionMap),
    dataSource: AppDataSource
}