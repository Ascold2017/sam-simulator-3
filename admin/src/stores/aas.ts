import { defineStore } from "pinia";
import { ref } from "vue";
import { httpClient } from "../adapters/httpClient";
import { AAListResponse, AA } from "../../../shared/models/aa.model";

export const useAAs = defineStore("aas", () => {
  const aas = ref<AA[]>([]);

  async function getAAs() {
    try {
      const response = await httpClient.get<AAListResponse>("/adm/aas");
      aas.value = response;
    } catch (error) {
      console.log(error);
    }
  }

  return {
    aas,
    getAAs,
  };
});
