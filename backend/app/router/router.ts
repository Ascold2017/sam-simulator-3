import { MissionController } from '../controllers/missions.controller';
import { AuthController } from '../controllers/auth.controller';
import { AAController } from '../controllers/aa.controller';
import { TargetController } from '../controllers/target.controller';
import express from 'express';
import { UserController } from '../controllers/users.controller';


const router = express.Router();
const authController = new AuthController()
const missionController = new MissionController()
const aaController = new AAController()
const targetController = new TargetController()
const userController = new UserController()

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/user', authController.authMiddleware(), (req, res) => authController.getUser(req, res));

router.get('/missions', authController.authMiddleware(), missionController.getMissions())
router.get('/aas', authController.authMiddleware(), aaController.getAAs())


router.get('/adm/missions', missionController.getMissionsExtended())
router.get('/adm/aas', aaController.getAAs())
router.get('/adm/targets', targetController.getTargets())
router.get('/adm/users', userController.getUsers())

export default router;