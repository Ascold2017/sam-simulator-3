import { defineStore } from "pinia";
import { socketClient } from "../adapters/socketClient";
import { useRouter } from "vue-router";
import { MissionStartedResponse, StartMissionPayload, MissionEnvironmentPayload } from "../../../shared/models/mission.model";
import { ref } from "vue";

export const useMissionStore = defineStore('mission', () => {
    const router = useRouter();
    const map = ref<MissionEnvironmentPayload['map']>({ size: 0, data: [] });
    const isInitialized = ref(false);

    function startMission() {
        socketClient.send<StartMissionPayload>('start_mission', { missionId: 1 })
    }

    socketClient.listenToEvent<MissionStartedResponse>('mission_started', (data) => {
        if (data.success) {
            router.push({ name: 'main' });
        } else {
            router.push({ name: 'error', query: { message: data.message } });
        }
    })

    socketClient.listenToEvent<MissionEnvironmentPayload>('mission_environment', (data) => {
        console.log(data);
        map.value = data.map;
        isInitialized.value = true;
    })


    return {
        startMission,
        isInitialized,
        map
    }
});