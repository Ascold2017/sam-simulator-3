import { defineStore } from "pinia";
import { ref } from "vue";
import { httpClient } from "../adapters/httpClient";
import { AdmMissionListResponse, AdmMission } from "../models/mission.model";

export const useMissions = defineStore('missions', () => {
    const missions = ref<AdmMission[]>([])

    async function getMissions() {
        try {
            const response = await httpClient.get<AdmMissionListResponse>('/adm/missions')
            missions.value = response;
        } catch (error) {
            console.log(error)
        }
    }

    async function deleteMission(id: number) {
        try {
            await httpClient.delete(`/adm/missions/${id}`)
            missions.value = missions.value.filter(mission => mission.id !== id)
        } catch (error) {
            console.log(error)
        }
    }

    return {
        missions,
        getMissions,
        deleteMission
    }
})