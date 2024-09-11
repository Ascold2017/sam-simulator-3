import type { AAListResponse } from "../../../shared/models/aa.model";
import { Request, Response } from "express";
import { AaService } from "../services/aa.service";

export class AAController {
  private aaService = new AaService();

  public getAAs() {
    return async (req: Request, res: Response) => {
      // Получаем миссии из базы данных
      const aas = await this.aaService.getAllAas();

      res.status(200).json(aas satisfies AAListResponse);
    };
  }
}
