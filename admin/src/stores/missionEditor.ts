import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";
import { useMaps } from "./maps";
import { httpClient } from "../adapters/httpClient";
import {
  AdmMissionExtendedResponse,
  CreateMissionPayload,
  Position,
  UpdateMissionPayload,
  Waypoint,
} from "../models/mission.model";
import { v4 as uuidv4 } from "uuid";

export interface EditableAAPosition {
  id: string;
  originalId?: number;
  position: Position;
  isDeleted: boolean;
  isEdited: boolean;
  isNew: boolean;
}

export interface EditableTarget {
  id: string;
  originalId?: number;
  targetId: number;
  waypoints: {
    speed: number;
    position: Position;
  }[];

  isDeleted: boolean;
  isEdited: boolean;
  isNew: boolean;
}
export const useMissionEditor = defineStore("mission-editor", () => {
  const mapsStore = useMaps();

  const missionId = ref<number | null>(null);
  const missionName = ref<string>("");
  const mapId = ref<number | null>(null);
  const aaPositions = ref<EditableAAPosition[]>([]);
  const targets = ref<EditableTarget[]>([]);

  const isChanged = ref(false)
  const isInitialized = ref(false)

  watch([missionName, mapId, aaPositions, targets], () => {
    if (isInitialized.value) {
      isChanged.value = true
    }
  }, { deep: true })

  const currentMap = computed(() => {
    if (!mapId.value) return null;
    return mapsStore.maps.find((m) => m.id === mapId.value);
  });

  async function saveMission() {

    const aaPositionsToCreate = aaPositions.value.filter(aaPosition => aaPosition.isNew).map(aaPosition => ({
        position: aaPosition.position
    }));
    const aaPositionsToUpdate = aaPositions.value.filter(aaPosition => aaPosition.originalId && aaPosition.isEdited).map(aaPosition => ({
        id: aaPosition.originalId!,
        position: aaPosition.position
    }));
    const aaPositionsToDelete = aaPositions.value.filter(aaPosition => aaPosition.originalId && aaPosition.isDeleted).map(aaPosition => aaPosition.originalId!);

    const targetsToCreate = targets.value.filter(target => target.isNew).map(target => ({
        targetId: target.targetId,
        waypoints: target.waypoints
    }));
    const targetsToUpdate = targets.value.filter(target => target.originalId && target.isEdited).map(target => ({
        id: target.originalId!,
        targetId: target.targetId,
        waypoints: target.waypoints
    }));
    const targetsToDelete = targets.value.filter(target => target.originalId && target.isDeleted).map(target => target.originalId!);
    if (missionId.value) {
        const payload: UpdateMissionPayload = {
            name: missionName.value,
            mapId: mapId.value!,
            aaPositionsToDelete,
            aaPositionsToUpdate,
            aaPositionsToCreate,
            targetsToDelete,
            targetsToUpdate,
            targetsToCreate
        }

        const response = await httpClient.put<{ missionId: number }>(
          "/adm/missions/" + missionId.value,
          payload
        );

    } else {
        const payload: CreateMissionPayload = {
            name: missionName.value,
            mapId: mapId.value!,
            aaPositionsToCreate,
            targetsToCreate
        }

        const response = await httpClient.post<{ missionId: number }>(
          "/adm/missions",
          payload
        );
    }
  }

  async function getMission(id: string) {
    try {
      const response = await httpClient.get<AdmMissionExtendedResponse>(
        `/adm/missions/${id}`
      );

      missionId.value = response.id;
      missionName.value = response.name;
      mapId.value = response.map.id;
      aaPositions.value = response.aaPositions.map((aaPosition) => ({
        id: uuidv4(),
        originalId: aaPosition.id,
        position: aaPosition.position,
        isDeleted: false,
        isEdited: false,
        isNew: false,
      }));
      targets.value = response.targets.map((target) => ({
        id: uuidv4(),
        originalId: target.id,
        targetId: target.target.id,
        waypoints: target.waypoints,
        isDeleted: false,
        isEdited: false,
        isNew: false,
      }));

      isInitialized.value = true;
    } catch (error) {
      console.error(error);
    }
  }

  function updateAAPosition(position: EditableAAPosition) {
    aaPositions.value = aaPositions.value.map((aaPosition) => {
      if (aaPosition.id === position.id) {
        return {
          ...position,
          isEdited: true,
        };
      }
      return aaPosition;
    });
  }

  function addAAPosition() {
    aaPositions.value.push({
      id: uuidv4(),
      position: {
        x: 0,
        y: 0,
        z: 0,
      },
      isDeleted: false,
      isEdited: false,
      isNew: true,
    });
  }

  function removeAAPosition(id: string) {
    aaPositions.value = aaPositions.value.map((aaPosition) => {
      if (aaPosition.id === id) {
        return {
          ...aaPosition,
          isDeleted: true,
        };
      }
      return aaPosition;
    });
  }

  function updateTarget(target: EditableTarget) {
    targets.value = targets.value.map((t) => {
      if (t.id === target.id) {
        return {
          ...target,
          isEdited: true,
        };
      }
      return t;
    });
  }

  function addTarget(targetId: number) {
    targets.value.push({
      id: uuidv4(),
      targetId,
      waypoints: [],
      isDeleted: false,
      isEdited: false,
      isNew: true,
    });
  }

  function removeTarget(id: string) {
    targets.value = targets.value.map((t) => {
      if (t.id === id) {
        return {
          ...t,
          isDeleted: true,
        };
      }
      return t;
    });
  }

  function addWaypoint(targetId: string) {
    if (!targets.value.some((t) => t.id === targetId)) return;
    const target = targets.value.find((t) => t.id === targetId)!;
    updateTarget({
      ...target,
      waypoints: [
        ...target.waypoints,
        {
          speed: 0,
          position: {
            x: 0,
            y: 0,
            z: 0,
          },
        },
      ],
    });
  }

  function updateWaypoint(targetId: string, index: number, waypoint: Waypoint) {
    if (!targets.value.some((t) => t.id === targetId)) return;
    const target = targets.value.find((t) => t.id === targetId)!;
    updateTarget({
      ...target,
      waypoints: [
        ...target.waypoints.slice(0, index),
        waypoint,
        ...target.waypoints.slice(index + 1),
      ],
    });
  }

  function removeWaypoint(targetId: string, index: number) {
    if (!targets.value.some((t) => t.id === targetId)) return;
    const target = targets.value.find((t) => t.id === targetId)!;
    updateTarget({
      ...target,
      waypoints: [
        ...target.waypoints.slice(0, index),
        ...target.waypoints.slice(index + 1),
      ],
    });
  }

  function $reset() {
    missionId.value = null;
    missionName.value = "";
    mapId.value = null;

    aaPositions.value = [];
    targets.value = [];

    isInitialized.value = false;
    isChanged.value = false;
  }

  return {
    isChanged,
    mapId,
    missionName,
    currentMap,
    aaPositions,
    targets,
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
