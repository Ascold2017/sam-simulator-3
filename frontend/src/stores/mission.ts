import { defineStore } from "pinia";
import { socketClient } from "../adapters/socketClient";
import { useRouter } from "vue-router";
import { MissionStartedResponse, StartMissionPayload, MissionEnvironmentPayload, FlightObjectsUpdateResponse } from "../../../shared/models/mission.model";
import { ref } from "vue";

export const useMissionStore = defineStore('mission', () => {
    const router = useRouter();
    const map = ref<MissionEnvironmentPayload['map']>({ size: 0, data: [] });
    const flightObjects = ref<FlightObjectsUpdateResponse>([])
    const isInitialized = ref(false);

    function startMission() {
        socketClient.send<StartMissionPayload>('start_mission', { missionId: 1 })
    }

    socketClient.listenToEvent<MissionStartedResponse>('mission_started', (data) => {
        if (data.success) {
            localStorage.setItem('missionId', data.missionId!.toString())
            router.push({ name: 'main', params: { id: data.missionId } });
        } else {
            router.push({ name: 'error', query: { message: data.message } });
        }
    })

    socketClient.listenToEvent('mission_stopped', () => {
        localStorage.removeItem('missionId')
        router.push({ name: 'start' })
        map.value = { size: 0, data: [] }
        flightObjects.value = []
        isInitialized.value = false;
    })

    socketClient.listenToEvent<MissionEnvironmentPayload>('mission_environment', (data) => {
        console.log(data);
        map.value = data.map;
        isInitialized.value = true;
    })

    socketClient.listenToEvent<FlightObjectsUpdateResponse>('flight_objects_update', (data) => {
        flightObjects.value = data;
    })

    function restoreMission() {
        const missionId = localStorage.getItem('missionId')
        if (missionId) {
            socketClient.send('restore_mission', { missionId: +missionId })
        }
    }

    function stopMission() {
        socketClient.send('stop_mission', undefined)
    }

    restoreMission();


    return {
        startMission,
        stopMission,
        isInitialized,
        map
    }
});