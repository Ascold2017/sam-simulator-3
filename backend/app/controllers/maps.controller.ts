import { Request, Response } from "express";
import { AdmMapListResponse } from "../types/map.model";
import { MapService } from "../services/map.service";

export class MapsController {
  private mapService = new MapService();

  public getMaps() {
    return async (req: Request, res: Response) => {
      // Получаем миссии из базы данных
      const maps = await this.mapService.getAllMaps();

      res.status(200).json(maps satisfies AdmMapListResponse);
    };
  }
}
