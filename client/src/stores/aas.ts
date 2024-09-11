import { defineStore } from "pinia";
import { ref } from "vue";
import { httpClient } from "../adapters/httpClient";
import { AA, AAListResponse } from "../models/aa.model";

export const useAAs = defineStore('aas', () => {
    const aas = ref<AA[]>([])

    async function getAAs() {
        const response = await httpClient.get<AAListResponse>('/aas')
        aas.value = response;
    }

    return {
        aas,
        getAAs
    }
})