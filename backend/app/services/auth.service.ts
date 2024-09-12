import { DI } from '../config/dataSource';
import { User } from '../entities/user.entity';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export class AuthService {

    async getUser(id: number) {
        return await DI.userRepository.findOne({ where: { id }, relations: ['aa'] });
    }

    // Регистрация пользователя
    async register(username: string, password: string): Promise<{ token: string; user: User }> {
        const existingUser = await DI.userRepository.findOne({ where: { username }, relations: ['aa'] });

        if (existingUser) {
            throw new Error('User already exists');
        }
        const hashedPassword = await argon2.hash(password);
        const aa = await DI.aaRepository.findOne({ where: { id: 1 }})
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
        console.log(password, user.password)
        const isPasswordValid = await argon2.verify(user.password, password);
        console.log(isPasswordValid)
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
            { expiresIn: '8h' } // Время жизни токена
        );
    }

    // Проверка токена (это можно использовать в middleware для проверки доступа)
     async verifyToken(token?: string) {
        if (!token) return new Error('Auth error: No token provided');
        try {
            const data = jwt.verify(token, process.env.TOKEN_SECRET) as { id: number; username: string };
            const user = await DI.userRepository.findOneOrFail({ where: { id: data.id }, relations: ['aa'] })

            return user;
        } catch (e) {
            console.error(e)
            return Promise.reject(new Error("Authentication error: Invalid token"))
        }
    }
}
