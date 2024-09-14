import { defineStore } from "pinia";
import { ref } from "vue";
import { httpClient } from "../adapters/httpClient";
import { AAListResponse, AA } from "../models/aa.model";
const defaultAA: EditableAA = {
  id: null,
  name: "",
  type: "active-missile",
  ammoMaxRange: 0,
  ammoVelocity: 0,
  viewAngle: 0,
  reloadTime: 0,
};
export interface EditableAA extends AA {
  id: number | null;
}
export const useAAs = defineStore("aas", () => {
  const aas = ref<AA[]>([]);

  const currentAA = ref<EditableAA>({
    ...defaultAA,
  });

  async function getAAs() {
    try {
      const response = await httpClient.get<AAListResponse>("/adm/aas");
      aas.value = response;
    } catch (error) {
      console.log(error);
    }
  }

  function setAA(aaId: number | null) {
    if (aaId) {
      currentAA.value = aas.value.find((aa) => aa.id === aaId);
    } else {
      currentAA.value = { ...defaultAA };
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
        return response.id;
      } else {
        const response = await httpClient.post<AA>("/adm/aas", currentAA.value);
        currentAA.value = response;
        return response.id;
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
    currentAA.value = { ...defaultAA };
    aas.value = [];
  }

  return {
    aas,
    getAAs,
    setAA,
    saveAA,
    deleteAA,
    currentAA,
    $reset,
  };
});
