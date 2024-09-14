import { defineStore } from "pinia";
import { ref } from "vue";
import { httpClient } from "../adapters/httpClient";
import { AAListResponse, AA } from "../models/aa.model";

export interface EditableAA extends AA {
  id: number | null;
}
export const useAAs = defineStore("aas", () => {
  const aas = ref<AA[]>([]);

  const currentAA = ref<EditableAA>({
    id: null,
    name: '',
    type: 'active-missile',
    ammoMaxRange: 0,
    ammoVelocity: 0,
    viewAngle: 0,
    reloadTime: 0
  });

  async function getAAs() {
    try {
      const response = await httpClient.get<AAListResponse>("/adm/aas");
      aas.value = response;
    } catch (error) {
      console.log(error);
    }
  }

  async function getAA(id: number) {
    try {
      const response = await httpClient.get<AA>(`/adm/aas/${id}`);
      currentAA.value = response;
    } catch (error) {
      console.log(error);
    }
  }

  async function saveAA() {
    try {
      if (currentAA.value.id) {
        const response = await httpClient.put<AA>(
          `/adm/aas/${currentAA.value.id}`,
          currentAA.value
        );
        currentAA.value = response;
        return response.id
      } else {
        const response = await httpClient.post<AA>(
          "/adm/aas",
          currentAA.value
        );
        currentAA.value = response;
        return response.id
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteAA(id: number) {
    try {
      await httpClient.delete(`/adm/aas/${id}`);
      getAAs();
    } catch (error) {
      console.log(error);
    }
  }

  function $reset() {
    currentAA.value = {
      id: null,
      name: '',
      type: 'active-missile',
      ammoMaxRange: 0,
      ammoVelocity: 0,
      viewAngle: 0,
      reloadTime: 0
    };

    aas.value = []
  }

  return {
    aas,
    getAAs,
    getAA,
    saveAA,
    deleteAA,
    currentAA,
    $reset
  };
});
