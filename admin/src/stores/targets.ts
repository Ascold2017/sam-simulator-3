import { defineStore } from "pinia";
import { ref } from "vue";
import { httpClient } from "../adapters/httpClient";
import { TargetListResponse, Target } from "../models/targets.model";

export interface EditableTarget extends Target {
  id: number | null;
}
export const useTargets = defineStore("targets", () => {
  const targets = ref<Target[]>([]);

  const currentTarget = ref<EditableTarget>({
    id: null,
    name: '',
    rcs: 0,
    temperature: 0,
    size: 0
  });

  async function getTargets() {
    try {
      const response = await httpClient.get<TargetListResponse>("/adm/targets");
      targets.value = response;
    } catch (error) {
      console.log(error);
    }
  }

  async function getTarget(id: number) {
    try {
      const response = await httpClient.get<Target>(`/adm/targets/${id}`);
      currentTarget.value = response;
    } catch (error) {
      console.log(error);
    }
  }

  async function saveTarget() {
    try {
      if (currentTarget.value.id) {
        const response = await httpClient.put<Target>(
          `/adm/targets/${currentTarget.value.id}`,
          currentTarget.value
        );
        currentTarget.value = response;
        return response.id
      } else {
        const response = await httpClient.post<Target>(
          "/adm/targets",
          currentTarget.value
        );
        currentTarget.value = response;
        return response.id
      }
    } catch (error) {
      console.log(error);
    }
  }


  async function deleteTarget(id: number) {
    try {
      await httpClient.delete(`/adm/targets/${id}`);
      targets.value = targets.value.filter((target) => target.id !== id);
    } catch (error) {
      console.log(error);
    }
  }

  function $reset() {
    currentTarget.value = {
      id: null,
      name: '',
      rcs: 0,
      temperature: 0,
      size: 0
    };

    targets.value = []
  }

  return {
    targets,
    currentTarget,
    getTargets,
    getTarget,
    saveTarget,
    deleteTarget,
    $reset
  };
});
