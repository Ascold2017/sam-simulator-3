import { MissionController } from '../controllers/missions.controller';
import { AuthController } from '../controllers/auth.controller';
import express from 'express';

const router = express.Router();
const authController = new AuthController()
const missionController = new MissionController()

router.post('/register', authController.register);
router.post('/login', authController.login);

router.get('/missions', missionController.getMissions)

export default router;