import { MissionController } from '../controllers/missions.controller';
import { AuthController } from '../controllers/auth.controller';
import { AAController } from '../controllers/aa.controller';
import express from 'express';

const router = express.Router();
const authController = new AuthController()
const missionController = new MissionController()
const aaController = new AAController()

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/user', authController.authMiddleware(), (req, res) => authController.getUser(req, res));

router.get('/missions', authController.authMiddleware(), (req, res) => missionController.getMissions(req, res))
router.get('/aas', authController.authMiddleware(), (req, res) =>aaController.getAAs(req, res))

export default router;