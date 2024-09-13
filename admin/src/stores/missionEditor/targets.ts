import { computed, ref } from "vue";
import { MissionTarget, Position, Waypoint } from "../../models/mission.model";
import { v4 as uuidv4 } from "uuid";

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

export const useTargets = () => {
  const targets = ref<EditableTarget[]>([]);

  const targetsToShow = computed(() =>
    targets.value.filter((target) => !target.isDeleted)
  );

  const targetsToCreate = computed(() =>
    targets.value
      .filter((target) => target.isNew)
      .map((target) => ({
        targetId: target.targetId,
        waypoints: target.waypoints,
      }))
  );
  const targetsToUpdate = computed(() =>
    targets.value
      .filter((target) => target.originalId && target.isEdited)
      .map((target) => ({
        id: target.originalId!,
        targetId: target.targetId,
        waypoints: target.waypoints,
      }))
  );
  const targetsToDelete = computed(() =>
    targets.value
      .filter((target) => target.originalId && target.isDeleted)
      .map((target) => target.originalId!)
  );

  function setTargets(data: MissionTarget[]) {
    targets.value = data.map((target) => ({
        id: uuidv4(),
        originalId: target.id,
        targetId: target.target.id,
        waypoints: target.waypoints,
        isDeleted: false,
        isEdited: false,
        isNew: false,
    }));
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

  return {
    targets,
    targetsToShow,
    targetsToCreate,
    targetsToUpdate,
    targetsToDelete,
    setTargets,
    updateTarget,
    addTarget,
    removeTarget,
    addWaypoint,
    updateWaypoint,
    removeWaypoint,
  };
};
