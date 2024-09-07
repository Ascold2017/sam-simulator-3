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
    const aas = ref<MissionData['aas']>([]);
    const aaPositions = ref<MissionData['aaPositions']>([])
    const aaId = ref<string | null>(null)
    const isInitialized = ref(false);

    const currentAA = computed(() => {
        return aas.value.find(aa => aa.id === aaId.value)
    });

    const parsedFlightObjects = computed<ParsedFlightObject[]>(() => {
        return [];
    })

    socketClient.listenToEvent('mission_environment', (data) => {
        map.value = data.map;
        aas.value = data.aas;
        aaId.value = data.yourAAId;
        aaPositions.value = data.aaPositions;
        isInitialized.value = true;
    })

    socketClient.listenToEvent('mission_aas_update', (aasData) => {
        aas.value = aasData;
    })

    socketClient.listenToEvent('mission_aas_positions_update', update => {
        aaPositions.value = update;
    })


    function selectCurrentAA(aaId: number) {
        socketClient.send('change_aa_position', aaId)
    }


    return {
        selectCurrentAA,
        isInitialized,
        map,
        aas,
        aaPositions,
        currentAA,
        parsedFlightObjects
    }
});