import { defineStore } from "pinia"
import { ref } from "vue"
import { httpClient } from "../adapters/httpClient"
import { AdmMapListResponse, Map } from "../models/map.model"

const genSquareArray = (size: number) => {
    const result: number[][] = []
    for (let i = 0; i < size; i++) {
        const row: number[] = []
        for (let j = 0; j < size; j++) {
            row.push(0)
        }
        result.push(row)
    }
    return result
}
export const useMaps = defineStore('maps', () => {
    const maps = ref<Map[]>([])
    const mapId = ref<number | null>(null);
    const mapName = ref<string>("");
    const mapFilename = ref<string>("");
    const mapData = ref<number[][]>(genSquareArray(10));
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
        mapData.value = response.data || genSquareArray(10)
        mapSize.value = response.size
    }

    async function saveMap() {
        if (mapId.value) {
            const response = await httpClient.put<Map>(`/adm/maps/${mapId.value}`, {
                id: mapId.value,
                name: mapName.value,
                filename: mapFilename.value,
                data: mapData.value,
                size: mapSize.value
            })
            mapId.value = response.id
        } else {
            const response = await httpClient.post<Map>('/adm/maps', {
                name: mapName.value,
                filename: mapFilename.value,
                data: mapData.value,
                size: mapSize.value
            })
            mapId.value = response.id
        }
    }


    async function deleteMap(mapId: number) {
        await httpClient.delete(`/adm/maps/${mapId}`)
        maps.value = maps.value.filter(map => map.id !== mapId)
    }

    function $reset() {
        mapId.value = null
        mapName.value = ''
        mapFilename.value = ''
        mapData.value = genSquareArray(10);
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