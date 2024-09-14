import type { AAListResponse, AA } from "../types/aa.model";
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

  public getAA() {
    return async (req: Request, res: Response) => {
      // Получаем миссии из базы данных
      const aa = await this.aaService.getAa(+req.params.id);
      res.status(200).json(aa satisfies AA);
    };
  }

  public postAA() {
    return async (req: Request, res: Response) => {
      const aa = await this.aaService.saveAa(req.body as AA);
      res.status(200).json(aa satisfies AA);
    };
  }

  public putAA() {
    return async (req: Request, res: Response) => {
      const aa = await this.aaService.saveAa(req.body as AA);
      res.status(200).json(aa satisfies AA);
    };
  }

  public deleteAA() {
    return async (req: Request, res: Response) => {
      await this.aaService.deleteAa(+req.params.id);
      res.status(200).json();
    };
  }
}
