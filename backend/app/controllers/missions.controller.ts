import type { CreateMissionPayload, MissionListResponse, UpdateMissionPayload } from '../types/mission.model'
import type { AdmMissionListResponse } from '../types/mission.model'
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

    public getMissionExtended() {
        return async (req: Request, res: Response) => {
            const mission = await this.missionService.getMissionById(+req.params.id)

            res.status(200).json(mission)
        }
    }

    public postMission() {
        return async (req: Request, res: Response) => {

            const missionId = await this.missionService.createMission(req.body as CreateMissionPayload)

            res.status(200).json({ missionId })

        }
    }

    public putMission() {
        return async (req: Request, res: Response) => {

            const missionId = await this.missionService.updateMission(+req.params.id , req.body as UpdateMissionPayload)

            res.status(200).json({ missionId })

        }
    }

    public deleteMission() {
        return async (req: Request, res: Response) => {
            const missionId = await this.missionService.deleteMission(+req.params.id)

            res.status(200).json({ missionId })
        }
    }
}