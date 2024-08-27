import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Mission } from '../entities/mission.entity';
import { Camera } from '../entities/camera.entity';
import { Radar } from '../entities/radar.entity';
import { Target } from '../entities/target.entity';

export class InitMissionDataFromFile1634567890123 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const filePath = path.join(__dirname, './missionData.json');
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        const missionDataRepository = queryRunner.manager.getRepository(Mission);
        const targetRepository = queryRunner.manager.getRepository(Target);
        const radarRepository = queryRunner.manager.getRepository(Radar);
        const cameraRepository = queryRunner.manager.getRepository(Camera);

        const mission = missionDataRepository.create({
            name: data.name,
            map: data.map,
        });
        await missionDataRepository.save(mission);

        for (const targetData of data.targets) {
            const target = targetRepository.create({
                ...targetData,
                mission,
            });
            await targetRepository.save(target);
        }

        for (const radarData of data.radars) {
            const radar = radarRepository.create({
                ...radarData,
                mission,
            });
            await radarRepository.save(radar);
        }

        for (const cameraData of data.cameras) {
            const camera = cameraRepository.create({
                ...cameraData,
                mission,
            });
            await cameraRepository.save(camera);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.getRepository(Camera).delete({});
        await queryRunner.manager.getRepository(Radar).delete({});
        await queryRunner.manager.getRepository(Target).delete({});
        await queryRunner.manager.getRepository(Mission).delete({});
    }
}