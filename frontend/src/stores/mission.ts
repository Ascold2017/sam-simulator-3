import { defineStore } from "pinia";
import { socketClient } from "../adapters/socketClient";
import { FlightObjectsUpdateResponse, CapturedTargetResponse } from "../../../shared/models/mission.model";
import { computed, ref } from "vue";
import type { MissionData } from "../../../shared/models/sockets.model";

export type FlightObject = FlightObjectsUpdateResponse[number]
export interface ParsedFlightObject extends FlightObject {
    isCaptured: boolean;
}
export const useMissionStore = defineStore('mission', () => {
    const map = ref<MissionData['map']>({ size: 0, data: [] });
    const flightObjects = ref<FlightObjectsUpdateResponse>([]);
    const capturedTargetIds = ref<CapturedTargetResponse>([])
    const aas = ref<MissionData['aas']>([]);
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
        currentAAId.value = data.yourAAId;
        isInitialized.value = true;
    })

    // socketClient.listenToEvent('')

    /*
    socketClient.listenToEvent<FlightObjectsUpdateResponse>('flight_objects_update', (data) => {
        flightObjects.value = data;
    })

    socketClient.listenToEvent<CapturedTargetResponse>('captured_targets_update', (data) => {
        capturedTargetIds.value = data;
    })
        */


    function selectCurrentAA(aaId: string) {
        // socketClient.send('change_aa_position', )
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