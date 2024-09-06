import { MigrationInterface, QueryRunner } from 'typeorm';
import { Mission } from '../entities/mission.entity';
import { MissionTarget } from '../entities/missionTarget.entity';
import { AA } from '../entities/aa.entity';
import { Target } from '../entities/target.entity';
import * as fs from 'fs';
import * as path from 'path';

// Функция для получения данных из файлов
function getDataFromFile<T>(fileName: string): T {
  const filePath = path.join(__dirname, fileName);
  const fileData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileData) as T;
}

export class InitMissionDataFromFile1634567890123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Загружаем данные из JSON файлов
    const missionData = getDataFromFile<any[]>('./missionData.json');
    const mapsData = getDataFromFile<any[]>('./mapsData.json');
    const targetData = getDataFromFile<any[]>('./targetData.json');
    const aaData = getDataFromFile<any[]>('./aaData.json');

    // Получаем репозитории
    const missionRepository = queryRunner.manager.getRepository(Mission);
    const missionTargetRepository = queryRunner.manager.getRepository(MissionTarget);
    const aaRepository = queryRunner.manager.getRepository(AA);
    const targetRepository = queryRunner.manager.getRepository(Target);

    // Сохраняем цели в базе данных
    for (const target of targetData) {
      const targetEntity = targetRepository.create({
        name: target.name,
        rcs: target.rcs,
        temperature: target.temperature,
        size: target.size,
      });
      await targetRepository.save(targetEntity);
    }

    // Сохраняем карты (mapId должны быть связаны с картами, если нужно)
    const savedMaps = mapsData.map(map => ({
      size: map.size,
      data: map.data,
    }));

    // Сохраняем миссии
    for (const mission of missionData) {
      // Предположим, что у каждой миссии есть карта (mapsData)
      const missionMap = savedMaps[0];
      
      const missionEntity = missionRepository.create({
        name: mission.name,
        map: missionMap,
        aaPositions: [], // Здесь можем позже добавить позиции для AA
      });
      await missionRepository.save(missionEntity);

      // Сохраняем цели миссии
      for (const target of mission.targets) {
        const targetEntity = await targetRepository.findOne({ where: { id: target.targetId } });

        const missionTargetEntity = missionTargetRepository.create({
          target: targetEntity,
          waypoints: target.waypoints,
          mission: missionEntity,
        });
        await missionTargetRepository.save(missionTargetEntity);
      }

      // Сохраняем зенитки для каждой миссии
      for (const aa of aaData) {
        const aaEntity = aaRepository.create({
          name: aa.name,
          type: aa.type,
          ammoMaxRange: aa.ammoMaxRange,
          ammoVelocity: aa.ammoVelocity,
          viewAngle: aa.viewAngle,
          reloadTime: aa.reloadTime
        });
        await aaRepository.save(aaEntity);
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.getRepository(MissionTarget).delete({});
    await queryRunner.manager.getRepository(Target).delete({});
    await queryRunner.manager.getRepository(AA).delete({});
    await queryRunner.manager.getRepository(Mission).delete({});
  }
}
