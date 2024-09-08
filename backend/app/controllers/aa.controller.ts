import { DI } from "../config/dataSource";
import type { AAListResponse } from '../../../shared/models/aa.model'
import { Request, Response } from "express";

export class AAController {

    public async getAAs(req: Request, res: Response) {
         // Получаем миссии из базы данных
         const aas = await DI.aaRepository.find({
            where: {}
        });

        res.status(200).json(aas satisfies AAListResponse)
    }
}