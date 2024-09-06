import { DI } from '../config/dataSource';
import { User } from '../entities/user.entity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AuthService {

    // Регистрация пользователя
    async register(username: string, password: string): Promise<{ token: string; user: User }> {
        const existingUser = await DI.userRepository.findOne({ where: { username }, relations: ['aa'] });

        if (existingUser) {
            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const aa = await DI.aaRepository.findOne({})
        const user = DI.userRepository.create({ username, password: hashedPassword, aa });

        const createdUser = await DI.userRepository.save(user)
        const token = this.generateToken(user);
        return { user: createdUser, token };
    }

    // Авторизация пользователя
    async login(username: string, password: string): Promise<{ token: string; user: User }> {
        const user = await DI.userRepository.findOne({ where: { username }, relations: ['aa'] });

        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = this.generateToken(user);
        return { token, user };
    }

    // Генерация JWT токена
    private generateToken(user: User): string {
        return jwt.sign(
            { id: user.id, username: user.username },
            process.env.TOKEN_SECRET, // Используй свой секретный ключ
            { expiresIn: '1h' } // Время жизни токена
        );
    }

    // Проверка токена (это можно использовать в middleware для проверки доступа)
    verifyToken(token: string): any {
        try {
            return jwt.verify(token, process.env.TOKEN_SECRET); // Вернется объект с данными пользователя
        } catch (e) {
            throw new Error('Invalid token');
        }
    }
}
