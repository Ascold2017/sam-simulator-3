import { defineStore } from "pinia"
import { ref } from "vue"
import { httpClient } from "../adapters/httpClient"
import { AdmMapListResponse, Map } from "../models/map.model"

export const useMaps = defineStore('maps', () => {
    const maps = ref<Map[]>([])

    async function getMaps() {
        const response = await httpClient.get<AdmMapListResponse>('/adm/maps')
        maps.value = response
    }
    return {
        maps,
        getMaps
    }
})