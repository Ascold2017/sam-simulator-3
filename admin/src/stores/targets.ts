import { defineStore } from "pinia";
import { ref } from "vue";
import { httpClient } from "../adapters/httpClient";
import { TargetListResponse, Target } from "../models/targets.model";

export const useTargets = defineStore("targets", () => {
  const targets = ref<Target[]>([]);

  async function getTargets() {
    try {
      const response = await httpClient.get<TargetListResponse>("/adm/targets");
      targets.value = response;
    } catch (error) {
      console.log(error);
    }
  }

  return {
    targets,
    getTargets,
  };
});
