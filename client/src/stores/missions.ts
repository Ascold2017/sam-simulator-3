import { defineStore } from "pinia";
import { ref } from "vue";
import { httpClient } from "../adapters/httpClient";
import { Mission, MissionListResponse } from "../models/mission.model";

export const useMissions = defineStore('missions', () => {
    const missions = ref<Mission[]>([])

    async function getMissions() {
        const response = await httpClient.get<MissionListResponse>('/missions')
        missions.value = response;
    }

    return {
        missions,
        getMissions
    }
})