import type { TargetListResponse, Target } from "../types/target.model";
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

  public getTarget() {
    return async (req: Request, res: Response) => {
      // Получаем миссии из базы данных
      const target = await this.targetService.getTarget(+req.params.id);
      res.status(200).json(target satisfies Target);
    };
  }

  public postTarget() {
    return async (req: Request, res: Response) => {
      const target = await this.targetService.saveTarget(req.body as Target);
      res.status(200).json(target satisfies Target);
    };
  }

  public putTarget() {
    return async (req: Request, res: Response) => {
     
      const target = await this.targetService.saveTarget(req.body as Target);
      res.status(200).json(target satisfies Target);
    };
  }

  public deleteTarget() {
    return async (req: Request, res: Response) => {
      await this.targetService.deleteTarget(+req.params.id);
      res.status(200).json();
    };
  }
}
