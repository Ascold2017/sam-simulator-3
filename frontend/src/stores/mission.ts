import { defineStore } from "pinia";
import { socketClient } from "../adapters/socketClient";
import { MissionEnvironmentPayload, FlightObjectsUpdateResponse, CapturedTargetResponse } from "../../../shared/models/mission.model";
import { computed, ref } from "vue";

export type FlightObject = FlightObjectsUpdateResponse[number]
export interface ParsedFlightObject extends FlightObject {
    isCaptured: boolean;
}
export const useMissionStore = defineStore('mission', () => {
    const map = ref<MissionEnvironmentPayload['map']>({ size: 0, data: [] });
    const flightObjects = ref<FlightObjectsUpdateResponse>([]);
    const capturedTargetIds = ref<CapturedTargetResponse>([])
    const aas = ref<MissionEnvironmentPayload['aas']>([]);
    const currentAAId = ref<string | null>(null)
    const isInitialized = ref(false);

    const currentAA = computed(() => aas.value.find(aa => aa.id === currentAAId.value));

    const parsedFlightObjects = computed<ParsedFlightObject[]>(() => {
        return flightObjects.value.map(fo => ({
            ...fo,
            isCaptured: capturedTargetIds.value.some(cti => cti.aaId === currentAAId.value && cti.targetId === fo.id)
        }))
    })

    socketClient.listenToEvent('mission_environment', (data) => {
        map.value = data.map;
        aas.value = data.aas;
        currentAAId.value = data.aas[0]?.id || null;
        isInitialized.value = true;
    })

    /*
    socketClient.listenToEvent<FlightObjectsUpdateResponse>('flight_objects_update', (data) => {
        flightObjects.value = data;
    })

    socketClient.listenToEvent<CapturedTargetResponse>('captured_targets_update', (data) => {
        capturedTargetIds.value = data;
    })
        */


    function selectCurrentAA(aaId: string) {
        currentAAId.value = aaId;
    }


    return {
        selectCurrentAA,
        isInitialized,
        map,
        aas,
        currentAA,
        parsedFlightObjects
    }
});