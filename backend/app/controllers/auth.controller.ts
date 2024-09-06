import { Request, Response, NextFunction } from 'express';
import { AuthService } from "../services/auth.service";

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
        const { id } = req.body.userState;
        try {
            const user = await authService.getUser(id);
            res.status(200).json({ user });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }

    }

    public async authMiddleware(req: Request, res: Response, next: NextFunction) {
        if (req.headers['authorization']) {
            try {
                req.body.userState = authService.verifyToken(req.headers['authorization']);
                next()
            } catch {
                next(false)
            }
            return;
        }
        next(false);
    }
}