import { Request, Response, NextFunction } from 'express';
import { AuthService } from "../services/auth.service";
import { DI } from '../config/dataSource';
import { Socket } from 'socket.io';
import { ExtendedError } from 'socket.io/dist/namespace';

const authService = new AuthService();

export class AuthController {

    public async register(req: Request, res: Response) {
        const { username, password } = req.body;

        try {
            const { user, token } = await authService.register(username, password);
            res.status(201).json({ message: 'User registered successfully', user, token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    public async login(req: Request, res: Response) {
        const { username, password } = req.body;

        try {
            const { token, user } = await authService.login(username, password);
            res.status(200).json({ message: 'Login successful', token, user });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    public async getUser(req: Request, res: Response) {
        const user = req.body.userState;
        if (user) {
            res.status(200).json({ user });
        } else {
            res.status(400).json({ error: 'Something went wrong' });
        }

    }

    public authMiddleware() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const token = req.headers['authorization'];

            if (token) {
                try {
                    req.body.userState = await authService.verifyToken(token);
                    next();
                } catch (error) {
                    console.error(error);
                    return res.status(401).json({ error: 'Unauthorized' });
                }
            } else {
                return res.status(401).json({ error: 'No token provided' });
            }
        }

    }

    public authSocketMiddleware() {
        return async (socket: Socket, next: (err?: ExtendedError) => void) => {
            const token = socket.handshake.auth.token;

            if (token) {
                try {
                    socket.data.user = await authService.verifyToken(token)
                    next();
                } catch (error) {
                    console.error(error);
                    next(new Error('Unauthorized'))
                }
            } else {
                return next(new Error('No token provided'))
            }
        }
    }
}