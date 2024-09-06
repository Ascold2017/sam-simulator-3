import { DI } from "../config/dataSource";
import type { MissionListResponse } from '../../../shared/models/mission.model'
import { Request, Response } from "express";

export class MissionController {

    public async getMissions(req: Request, res: Response) {
         // Получаем миссии из базы данных
         const missions = await DI.missionRepository.find({
            select: ['id', 'name'],
            where: {}
        });

        res.status(200).json(missions as MissionListResponse)
    }
}