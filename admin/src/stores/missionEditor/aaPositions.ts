import { computed, ref } from "vue";
import { AAPosition, Position } from "../../models/mission.model";
import { v4 as uuidv4 } from "uuid";

export interface EditableAAPosition {
  id: string;
  originalId?: number;
  position: Position;
  isDeleted: boolean;
  isEdited: boolean;
  isNew: boolean;
}

export const useAAPositions = () => {
  const aaPositions = ref<EditableAAPosition[]>([]);

  const aaPositionsToShow = computed(() =>
    aaPositions.value.filter((aaPosition) => !aaPosition.isDeleted))

  const aaPositionsToCreate = computed(() =>
    aaPositions.value
      .filter((aaPosition) => aaPosition.isNew)
      .map((aaPosition) => ({
        position: aaPosition.position,
      }))
  );
  const aaPositionsToUpdate = computed(() =>
    aaPositions.value
      .filter((aaPosition) => aaPosition.originalId && aaPosition.isEdited)
      .map((aaPosition) => ({
        id: aaPosition.originalId!,
        position: aaPosition.position,
      }))
  );
  const aaPositionsToDelete = computed(() =>
    aaPositions.value
      .filter((aaPosition) => aaPosition.originalId && aaPosition.isDeleted)
      .map((aaPosition) => aaPosition.originalId!)
  );

  function setAAPositions(data: AAPosition[]) {
    aaPositions.value = data.map((aaPosition) => ({
      id: uuidv4(),
      originalId: aaPosition.id,
      position: aaPosition.position,
      isDeleted: false,
      isEdited: false,
      isNew: false,
    }));
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
        y: 100,
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

  return {
    aaPositions,
    aaPositionsToShow,
    aaPositionsToCreate,
    aaPositionsToUpdate,
    aaPositionsToDelete,

    setAAPositions,
    updateAAPosition,
    addAAPosition,
    removeAAPosition,
  };
};
