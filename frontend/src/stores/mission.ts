import { defineStore } from "pinia";
import { socketClient } from "../adapters/socketClient";
import { useRouter } from "vue-router";
import { MissionStartedResponse, StartMissionPayload, MissionEnvironmentPayload, FlightObjectsUpdateResponse } from "../../../shared/models/mission.model";
import { computed, ref } from "vue";

export const useMissionStore = defineStore('mission', () => {
    const router = useRouter();
    const map = ref<MissionEnvironmentPayload['map']>({ size: 0, data: [] });
    const flightObjects = ref<FlightObjectsUpdateResponse>([])
    const aas = ref<MissionEnvironmentPayload['aas']>([]);
    const currentAAId = ref<string | null>(null)
    const isInitialized = ref(false);

    const currentAA = computed(() => aas.value.find(aa => aa.id === currentAAId.value));

    function startMission() {
        socketClient.send<StartMissionPayload>('start_mission', { missionId: 1 })
    }

    socketClient.listenToEvent<MissionStartedResponse>('mission_started', (data) => {
        if (data.success) {
            localStorage.setItem('missionId', data.missionId!.toString())
            router.push({ name: 'main', params: { id: data.missionId } });
        } else {
            router.push({ name: 'start', query: { message: data.message } });
        }
    })

    socketClient.listenToEvent('mission_stopped', () => {
        localStorage.removeItem('missionId')
        router.push({ name: 'start' })
        map.value = { size: 0, data: [] }
        flightObjects.value = []
        aas.value = []
        currentAAId.value = null;
        isInitialized.value = false;
    })

    socketClient.listenToEvent<MissionEnvironmentPayload>('mission_environment', (data) => {
        map.value = data.map;
        aas.value = data.aas;
        currentAAId.value = data.aas[0]?.id || null;
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

    function selectCurrentAA(aaId: string) {
        currentAAId.value = aaId;
    }


    return {
        startMission,
        stopMission,
        selectCurrentAA,
        isInitialized,
        map,
        aas,
        currentAA,
        flightObjects
    }
});