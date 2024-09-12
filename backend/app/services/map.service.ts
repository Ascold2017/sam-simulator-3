import { DI } from "../config/dataSource";

export class MapService {

    async getAllMaps() {
        const maps = await DI.mapRepository.find({
            where: {}
        });
        return maps;
    }
}