import { MigrationInterface, QueryRunner } from 'typeorm';
import { Mission } from '../entities/mission.entity';
import { MissionTarget } from '../entities/missionTarget.entity';
import { AA } from '../entities/aa.entity';
import { Target } from '../entities/target.entity';
import * as fs from 'fs';
import * as path from 'path';
import { Map } from '../entities/map.entity';

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
    const mapRepository = queryRunner.manager.getRepository(Map);

    // Сохраняем цели (Target) в базе данных
    for (const target of targetData) {
      const targetEntity = targetRepository.create({
        name: target.name,
        rcs: target.rcs,
        temperature: target.temperature,
        size: target.size,
      });
      await targetRepository.save(targetEntity);
    }

    // Сохраняем карты (Map) в базе данных
    const savedMaps = [];
    for (const map of mapsData) {
      const mapEntity = mapRepository.create({
        name: map.name,
        map: {
          size: map.size,
          data: map.data,
        },
      });
      const savedMap = await mapRepository.save(mapEntity);
      savedMaps.push(savedMap);
    }

    // Сохраняем зенитки (AA)
    for (const aa of aaData) {
      const aaEntity = aaRepository.create({
        name: aa.name,
        type: aa.type,
        ammoMaxRange: aa.ammoMaxRange,
        ammoVelocity: aa.ammoVelocity,
        viewAngle: aa.viewAngle,
        reloadTime: aa.reloadTime, // Учитываем время перезарядки
      });
      await aaRepository.save(aaEntity);
    }

    // Сохраняем миссии (Mission)
    for (const mission of missionData) {
      const missionMap = savedMaps.find(map => map.id === mission.mapId);

      if (!missionMap) {
        throw new Error(`Map with id ${mission.mapId} not found`);
      }

      const missionEntity = missionRepository.create({
        name: mission.name,
        map: missionMap,
        aaPositions: mission.aaPositions,
      });
      const savedMission = await missionRepository.save(missionEntity);

      // Сохраняем цели миссии (MissionTarget)
      for (const target of mission.targets) {
        const targetEntity = await targetRepository.findOne({ where: { id: target.targetId } });

        if (!targetEntity) {
          throw new Error(`Target with id ${target.targetId} not found`);
        }

        const missionTargetEntity = missionTargetRepository.create({
          target: targetEntity,
          waypoints: target.waypoints,
          mission: savedMission,
        });
        await missionTargetRepository.save(missionTargetEntity);
      }

      
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.getRepository(MissionTarget).delete({});
    await queryRunner.manager.getRepository(Target).delete({});
    await queryRunner.manager.getRepository(AA).delete({});
    await queryRunner.manager.getRepository(Mission).delete({});
    await queryRunner.manager.getRepository(Map).delete({});
  }
}
