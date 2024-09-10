import { DI } from "../config/dataSource";

export class AaService {

    async getAllAas() {
        const aas = await DI.aaRepository.find({
            where: {}
        });
        return aas;
    }
}