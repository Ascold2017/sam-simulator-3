import { coreInstance } from "../config/coreInstance";
import { AppDataSource } from "../config/dataSource";
import { missionDto } from "../dto/mission.dto";
import { Mission } from "../entities/mission.entity";
import { MissionEnvironmentPayload, MissionStartedResponse, MissionStoppedResponse, StartMissionPayload } from "@shared/models/mission.model";

/**
 * Controller to handle the start and stop of a mission.
 * 
 * @param {Object} io - The Socket.IO server instance.
 * @param {Object} socket - The Socket.IO socket instance.
 * 
 * @event start_mission
 * @param {Object} payload - The payload for starting a mission.
 * @param {number} payload.missionId - The ID of the mission to start.
 * 
 * @event mission_started
 * @param {Object} payload - The payload for mission started event.
 * @param {boolean} payload.success - Indicates if the mission started successfully.
 * @param {number} [payload.missionId] - The ID of the mission that was started.
 * @param {string} [payload.message] - Error message if the mission did not start.
 * 
 * @event mission_environment
 * @param {Object} payload - The payload for mission environment event.
 * @param {Object} payload.map - The heightmap terrain data.
 * 
 * @event stop_mission
 * @param {Object} payload - The payload for stopping a mission.
 * 
 * @event mission_stopped
 * @param {Object} payload - The payload for mission stopped event.
 * @param {boolean} payload.success - Indicates if the mission stopped successfully.
 */
export const missionController = async (io, socket) => {
    socket.on('restore_mission', async (payload: StartMissionPayload) => {
        const { missionId } = payload;
        if (!coreInstance.engineIsStarted) {
            socket.emit('mission_started', { success: false, message: 'Mission not found' } as MissionStartedResponse);
            return;
        };

        socket.emit('mission_started', { success: true, missionId } as MissionStartedResponse);
        const heightmapTerrain = coreInstance.getHeightmapTerrain();
        const aas = coreInstance.getAAs()
        socket.emit('mission_environment', {
            map: {
                data: heightmapTerrain.data,
                size: heightmapTerrain.elementSize
            },
            aas
        } satisfies MissionEnvironmentPayload)

    });

    socket.on('start_mission', async (payload: StartMissionPayload) => {
        const { missionId } = payload;
        // Получаем данные миссии из базы данных
        try {
            const missionData = await AppDataSource.getRepository(Mission).findOne({
                where: {
                    id: missionId
                },
                relations: ['targets', 'aas']
            })


            const parsedMissionData = missionDto(missionData)
            if (missionData) {
                // Вызываем метод startMission у coreInstance
                coreInstance.startMission(parsedMissionData);
                socket.emit('mission_started', { success: true, missionId } as MissionStartedResponse);
                const heightmapTerrain = coreInstance.getHeightmapTerrain();
                const aas = coreInstance.getAAs()
                socket.emit('mission_environment', {
                    map: {
                        data: heightmapTerrain.data,
                        size: heightmapTerrain.elementSize
                    },
                    aas
                } satisfies MissionEnvironmentPayload)
            } else {
                socket.emit('mission_started', { success: false, message: 'Mission not found' } as MissionStartedResponse);
            }
        } catch (error) {
            console.error('Error starting mission:', error);
            socket.emit('mission_started', { success: false, message: 'Error starting mission' } as MissionStartedResponse);
        }
    });

    socket.on('stop_mission', async (payload) => {
        coreInstance.stopMission()
        socket.emit('mission_stopped', { success: true } as MissionStoppedResponse);
    });
}