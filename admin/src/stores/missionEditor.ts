import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useMaps } from "./maps";

export const useMissionEditor = defineStore('mission-editor', () => {

    const mapsStore = useMaps();

    const missionName = ref<string>('')
    const mapId = ref<number | null>(null)

    const currentMap = computed(() => {
        if (!mapId.value) return null;
        return mapsStore.maps.find(m => m.id === mapId.value)
    })
    
    function saveMission() {

    }

    return {
        mapId,
        missionName,
        currentMap,
        saveMission
    }

})