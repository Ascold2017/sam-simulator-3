import { MissionController } from '../controllers/missions.controller';
import { AuthController } from '../controllers/auth.controller';
import { AAController } from '../controllers/aa.controller';
import express from 'express';

const router = express.Router();
const authController = new AuthController()
const missionController = new MissionController()
const aaController = new AAController()

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/user', authController.authMiddleware(), authController.getUser);

router.get('/missions', authController.authMiddleware(), missionController.getMissions)
router.get('/aas', authController.authMiddleware(), aaController.getAAs)

export default router;