import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { useMaps } from "../maps";
import { httpClient } from "../../adapters/httpClient";
import {
  AdmMissionExtendedResponse,
  CreateMissionPayload,
  UpdateMissionPayload,
} from "../../models/mission.model";
import { useAAPositions } from "./aaPositions";
import { useTargets } from "./targets";


export const useMissionEditor = defineStore("mission-editor", () => {
  const mapsStore = useMaps();

  const missionId = ref<number | null>(null);
  const missionName = ref<string>("");
  const missionDuration = ref(1000)
  const mapId = ref<number | null>(null);

  const {
    aaPositions,
    aaPositionsToShow,
    aaPositionsToCreate,
    aaPositionsToUpdate,
    aaPositionsToDelete,
    setAAPositions,
    addAAPosition,
    updateAAPosition,
    removeAAPosition,
  } = useAAPositions();

  const {
    targets,
    targetsToShow,
    targetsToCreate,
    targetsToUpdate,
    targetsToDelete,
    setTargets,
    addTarget,
    updateTarget,
    removeTarget,
    addWaypoint,
    updateWaypoint,
    removeWaypoint,
  } = useTargets()

  const isChanged = ref(false);
  const isInitialized = ref(false);

  watch(
    [missionName, mapId, aaPositions, targets],
    () => {
      if (isInitialized.value) {
        isChanged.value = true;
      }
    },
    { deep: true }
  );

  const currentMap = computed(() => {
    if (!mapId.value) return null;
    return mapsStore.maps.find((m) => m.id === mapId.value);
  });

  async function saveMission() {

    
    if (missionId.value) {
      const payload: UpdateMissionPayload = {
        name: missionName.value,
        mapId: mapId.value!,
        duration: missionDuration.value,
        aaPositionsToDelete: aaPositionsToDelete.value,
        aaPositionsToUpdate: aaPositionsToUpdate.value,
        aaPositionsToCreate: aaPositionsToCreate.value,
        targetsToDelete: targetsToDelete.value,
        targetsToUpdate: targetsToUpdate.value,
        targetsToCreate: targetsToCreate.value,
      };

      const response = await httpClient.put<{ missionId: number }>(
        "/adm/missions/" + missionId.value,
        payload
      );

      return response.missionId;
    } else {
      const payload: CreateMissionPayload = {
        name: missionName.value,
        mapId: mapId.value!,
        duration: missionDuration.value,
        aaPositionsToCreate: aaPositionsToCreate.value,
        targetsToCreate: targetsToCreate.value,
      };

      const response = await httpClient.post<{ missionId: number }>(
        "/adm/missions",
        payload
      );

      return response.missionId;
    }
  }

  async function getMission(id: string) {
    try {
      const response = await httpClient.get<AdmMissionExtendedResponse>(
        `/adm/missions/${id}`
      );

      missionId.value = response.id;
      missionName.value = response.name;
      missionDuration.value = response.duration;
      
      mapId.value = response.map.id;
      setAAPositions(response.aaPositions);
      setTargets(response.targets);

      isInitialized.value = true;
    } catch (error) {
      console.error(error);
    }
  }

  

  function $reset() {
    missionId.value = null;
    missionName.value = "";
    mapId.value = null;

    setAAPositions([]);
    setTargets([]);

    isInitialized.value = false;
    isChanged.value = false;
  }

  return {
    isChanged,
    mapId,
    missionName,
    missionDuration,
    currentMap,
    aaPositions,
    aaPositionsToShow,
    targets,
    targetsToShow,
    saveMission,
    getMission,
    $reset,

    addAAPosition,
    updateAAPosition,
    removeAAPosition,

    addTarget,
    updateTarget,
    removeTarget,

    addWaypoint,
    updateWaypoint,
    removeWaypoint,
  };
});
