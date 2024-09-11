import type { MissionListResponse } from '../../../shared/models/mission.model'
import type { AdmMissionListResponse } from '../../../shared/admModels/mission.model'
import { Request, Response } from "express";
import { MissionService } from "../services/mission.service";

export class MissionController {
    private missionService = new MissionService()

    public getMissions() {
        return async (req: Request, res: Response) => {
            const missions = await this.missionService.getAllMissions()

            res.status(200).json(missions as MissionListResponse)
        }
        
    }

    public getMissionsExtended() {
        return async (req: Request, res: Response) => {
            const missions = await this.missionService.getAllMissionsExtended()

            res.status(200).json(missions satisfies AdmMissionListResponse)
        }
    }
}