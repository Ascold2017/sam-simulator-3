import type { TargetListResponse } from "../../../shared/admModels/targets.model";
import { Request, Response } from "express";
import { TargetService } from "../services/target.service";

export class TargetController {
  private targetService = new TargetService();

  public getTargets() {
    return async (req: Request, res: Response) => {
      // Получаем миссии из базы данных
      const aas = await this.targetService.getAllTargets();

      res.status(200).json(aas satisfies TargetListResponse);
    };
  }
}
