import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Mission } from '../entities/mission.entity';
import { Target } from '../entities/target.entity';

export class InitMissionDataFromFile1634567890123 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        const filePath = path.join(__dirname, './missionData.json');
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        const missionDataRepository = queryRunner.manager.getRepository(Mission);
        const targetRepository = queryRunner.manager.getRepository(Target);

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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.manager.getRepository(Target).delete({});
        await queryRunner.manager.getRepository(Mission).delete({});
    }
}