import { MissionController } from '../controllers/missions.controller';
import { AuthController } from '../controllers/auth.controller';
import { AAController } from '../controllers/aa.controller';
import { TargetController } from '../controllers/target.controller';
import express from 'express';
import { UserController } from '../controllers/users.controller';
import { MapsController } from '../controllers/maps.controller';


const router = express.Router();
const authController = new AuthController()
const missionController = new MissionController()
const aaController = new AAController()
const targetController = new TargetController()
const userController = new UserController()
const mapController = new MapsController()

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/user', authController.authMiddleware(), (req, res) => authController.getUser(req, res));

router.get('/missions', authController.authMiddleware(), missionController.getMissions())
router.get('/aas', authController.authMiddleware(), aaController.getAAs())
router.get('/targets', authController.authMiddleware(), targetController.getTargets())

// ADM
router.get('/adm/missions', authController.authMiddleware('admin'), missionController.getMissionsExtended())
router.get('/adm/missions/:id',  authController.authMiddleware('admin'), missionController.getMissionExtended())
router.post('/adm/missions',  authController.authMiddleware('admin'), missionController.postMission())
router.put('/adm/missions/:id',  authController.authMiddleware('admin'), missionController.putMission())
router.delete('/adm/missions/:id',  authController.authMiddleware('admin'), missionController.deleteMission())

router.get('/adm/aas',  authController.authMiddleware('admin'), aaController.getAAs())
router.get('/adm/aas/:id',  authController.authMiddleware('admin'), aaController.getAA())
router.post('/adm/aas',  authController.authMiddleware('admin'), aaController.postAA())
router.put('/adm/aas/:id',  authController.authMiddleware('admin'), aaController.putAA())
router.delete('/adm/aas/:id',  authController.authMiddleware('admin'), aaController.deleteAA())

router.get('/adm/targets',  authController.authMiddleware('admin'), targetController.getTargets())
router.get('/adm/targets/:id',  authController.authMiddleware('admin'), targetController.getTarget())
router.post('/adm/targets',  authController.authMiddleware('admin'), targetController.postTarget())
router.put('/adm/targets/:id',  authController.authMiddleware('admin'), targetController.putTarget())
router.delete('/adm/targets/:id',  authController.authMiddleware('admin'), targetController.deleteTarget())

router.get('/adm/users',  authController.authMiddleware('admin'), userController.getUsers())
router.patch('/adm/users/premium/:id',  authController.authMiddleware('admin'), userController.pathcUserPremium())
router.patch('/adm/users/role/:id',  authController.authMiddleware('admin'), userController.patchUserRole())
router.delete('/adm/users/:id',  authController.authMiddleware('admin'), userController.deleteUser())

router.get('/adm/maps',  authController.authMiddleware('admin'), mapController.getMaps())
router.get('/adm/maps/:id',  authController.authMiddleware('admin'), mapController.getMapById())
router.post('/adm/maps',  authController.authMiddleware('admin'), mapController.postMap())
router.put('/adm/maps/:id', authController.authMiddleware('admin'), mapController.putMap())
router.delete('/adm/maps/:id', authController.authMiddleware('admin'), mapController.deleteMap())

export default router;