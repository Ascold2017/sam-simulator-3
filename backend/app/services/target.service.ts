import { DI } from "../config/dataSource";

export class TargetService {

    async getAllTargets() {
        const targets = await DI.targetRepository.find({
            where: {}
        });
        return targets;
    }

    async getTarget(id: number) {
        const target = await DI.targetRepository.findOneBy({
            id
        });
        return target;
    }

    async saveTarget(target: any) {
        const newTarget = await DI.targetRepository.save(target);
        return newTarget;
    }

    async deleteTarget(id: number) {
        await DI.targetRepository.delete(id);
    }
}