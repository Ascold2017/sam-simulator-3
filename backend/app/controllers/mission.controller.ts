import { coreInstance } from "../config/coreInstance";
import { AppDataSource } from "../config/dataSource";
import { missionDto, radarDTO } from "../dto/mission.dto";
import { Mission } from "../entities/mission.entity";

/**

 * Controller to handle the start of a mission.
 * 
 * @param {Object} io - The Socket.IO server instance.
 * @param {Object} socket - The Socket.IO socket instance.
 */
export const missionController = async (io, socket) => {
    socket.on('start_mission', async (payload) => {
        const { missionId } = payload;
        // Получаем данные миссии из базы данных
        try {
            const missionData = await AppDataSource.getRepository(Mission).findOne({
                where: {
                    id: missionId
                },
                relations: ['targets', 'radars', 'cameras']
            })

            const parsedMissionData = missionDto(missionData)
            if (missionData) {
                // Вызываем метод startMission у coreInstance
                coreInstance.startMission(parsedMissionData);
                socket.emit('mission_started', { success: true, missionId });
                socket.emit('mission_environment', {
                    map: coreInstance.getHeightmapTerrain(),
                    radars: coreInstance.getRadars().map(radarDTO),
                    // cameras: coreInstance.getCameras()
                })
            } else {
                socket.emit('mission_started', { success: false, message: 'Mission not found' });
            }
        } catch (error) {
            console.error('Error starting mission:', error);
            socket.emit('mission_started', { success: false, message: 'Error starting mission' });
        }
    });

    socket.on('stop_mission', async (payload) => {
        coreInstance.stopMission()
        socket.emit('mission_stopped', { success: true });
    });
}