import { Request, Response } from "express";
import { AdmMapListResponse, Map } from "../types/map.model";
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

  public getMapById() {
    return async (req: Request, res: Response) => {
      // Получаем миссии из базы данных
      const map = await this.mapService.getMapById(+req.params.id);

      res.status(200).json(map satisfies Map);
    };
  }

  public postMap() {
    return async (req: Request, res: Response) => {
      // Сохраняем миссию в базу данных
      const map = await this.mapService.saveMap(req.body as Map);
      res.status(200).json(map satisfies Map);
    };
  }

  public putMap() {
    return async (req: Request, res: Response) => {
      // Обновляем миссию в базе данных
      const map = await this.mapService.saveMap(req.body as Map);
      res.status(200).json(map satisfies Map);
    };
  }

  public deleteMap() {
    return async (req: Request, res: Response) => {
      // Удаляем миссию из базы данных
      await this.mapService.deleteMap(+req.params.id);
      res.status(200).json();
    };
  }
}
