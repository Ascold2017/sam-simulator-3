import { defineStore } from "pinia";
import { ref } from "vue";
import { httpClient } from "../adapters/httpClient";
import { Target, TargetListResponse } from "../models/target.model";

export const useTargets = defineStore('targets', () => {
    const targets = ref<Target[]>([])

    async function getTargets() {
        const response = await httpClient.get<TargetListResponse>('/targets')
        targets.value = response;
    }

    return {
        targets,
        getTargets
    }
})