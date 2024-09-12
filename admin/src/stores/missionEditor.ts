import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useMaps } from "./maps";
import { httpClient } from "../adapters/httpClient";
import { AAPosition, AdmMissionExtendedResponse } from "../models/mission.model";

export const useMissionEditor = defineStore('mission-editor', () => {

    const mapsStore = useMaps();

    const missionName = ref<string>('')
    const mapId = ref<number | null>(null)
    const aaPositions = ref<AAPosition[]>([])

    const currentMap = computed(() => {
        if (!mapId.value) return null;
        return mapsStore.maps.find(m => m.id === mapId.value)
    })
    
    function saveMission() {

    }

    async function getMission(missionId: string) {
        try {
            const response = await httpClient.get<AdmMissionExtendedResponse>(`/adm/missions/${missionId}`)

            missionName.value = response.name
            mapId.value = response.map.id
            aaPositions.value = response.aaPositions;
        } catch (error) {
            console.error(error)
        }
    }

    function $reset() {
        missionName.value = ''
        mapId.value = null
    }

    return {
        mapId,
        missionName,
        currentMap,
        aaPositions,
        saveMission,
        getMission,
        $reset
    }

})