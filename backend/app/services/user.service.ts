import { DI } from "../config/dataSource";

export class UserService {

    async getAllUsers() {
        const users = await DI.userRepository.find({
            where: {},
            select: ['id', 'username', 'isPremium', 'role'],
            relations: ['aa']
        });
        return users;
    }

    async setUserPremium(id: number, isPremium: boolean) {
        const user = await DI.userRepository.findOne({ where: { id } });
        user.isPremium = isPremium;
        await DI.userRepository.save(user);
    }

    async setUserRole(id: number, role: 'user' | 'admin') {
        const user = await DI.userRepository.findOne({ where: { id } });
        user.role = role;
        await DI.userRepository.save(user);
    }

    async deleteUser(id: number) {
        await DI.userRepository.delete(id);
    }
}