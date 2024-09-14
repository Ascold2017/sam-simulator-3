import { DI } from "../config/dataSource";

export class AaService {

    async getAllAas() {
        const aas = await DI.aaRepository.find({
            where: {}
        });
        return aas;
    }

    async getAa(id: number) {
        const aa = await DI.aaRepository.findOneBy({
            id
        });
        return aa;
    }

    async saveAa(aa: any) {
        const newAa = await DI.aaRepository.save(aa);
        return newAa;
    }

    async deleteAa(id: number) {
        await DI.aaRepository.delete(id);
    }
    
}