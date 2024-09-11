import { DI } from "../config/dataSource";

export class UserService {

    async getAllUsers() {
        const users = await DI.userRepository.find({
            where: {}
        });
        return users;
    }
}