import { DI } from "../config/dataSource";

export class MapService {

    async getAllMaps() {
        const maps = await DI.mapRepository.find({
            where: {}
        });
        return maps;
    }

    async getMapById(id: number) {
        const map = await DI.mapRepository.findOne({
            where: {
                id
            }
        });
        return map;
    }

    async saveMap(map: any) {
        const newMap = await DI.mapRepository.save(map);
        return newMap;
    }

    async deleteMap(id: number) {
        await DI.mapRepository.delete(id);
    }
}