import { defineStore } from "pinia"
import { ref } from "vue"
import { httpClient } from "../adapters/httpClient"
import { AdmMapListResponse, Map } from "../models/map.model"

export const useMaps = defineStore('maps', () => {
    const maps = ref<Map[]>([])
    const mapId = ref<number | null>(null);
    const mapName = ref<string>("");
    const mapFilename = ref<string>("");
    const mapData = ref<number[][]>([]);
    const mapSize = ref<number>(0);


    async function getMaps() {
        const response = await httpClient.get<AdmMapListResponse>('/adm/maps')
        maps.value = response
    }

    async function getMapById(id: number) {
        const response = await httpClient.get<Map>(`/adm/maps/${id}`)
        mapId.value = response.id
        mapName.value = response.name
        mapFilename.value = response.filename
        mapData.value = response.data
        mapSize.value = response.size
    }

    async function saveMap() {}


    async function deleteMap(mapId: number) {}

    function $reset() {
        mapId.value = null
        mapName.value = ''
        mapFilename.value = ''
        mapData.value = []
        mapSize.value = 0
    }
    return {
        maps,
        mapId,
        mapName,
        mapFilename,
        mapData,
        mapSize,
        getMaps,
        getMapById,
        deleteMap,
        saveMap,
        $reset
    }
})