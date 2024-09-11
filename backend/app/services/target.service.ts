import { DI } from "../config/dataSource";

export class TargetService {

    async getAllTargets() {
        const targets = await DI.targetRepository.find({
            where: {}
        });
        return targets;
    }
}