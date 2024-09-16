import { defineStore } from "pinia";
import { socketClient } from "../adapters/socketClient";
import { computed, ref, watch } from "vue";
import { MissionUpdate, type MissionData } from "../models/sockets.model";
import { useNotificationStore } from "./notifications";

export type FlightObject = MissionUpdate["flightObjects"][number];
export type AAObject = MissionData["aas"][number];
export interface ParsedFlightObject extends FlightObject {
  isCaptured: boolean;
}
export const useGameStore = defineStore("game", () => {
  const notifications = useNotificationStore();

  const map = ref<MissionData["mapName"]>("");
  const aas = ref<AAObject[]>([]);
  const aaPositions = ref<MissionData["aaPositions"]>([]);
  const aaId = ref<string | null>(null);
  const flightObjects = ref<FlightObject[]>([]);
  const capturedTargetId = ref<string | null>(null);
  const direction = ref<{ azimuth: number; elevation: number }>({
    azimuth: 0,
    elevation: 0,
  });
  const isInitialized = ref(false);

  const currentAA = computed(() => {
    return aas.value.find((aa) => aa.id === aaId.value);
  });

  const parsedFlightObjects = computed<ParsedFlightObject[]>(() => {
    return flightObjects.value.map((fo) => ({
      ...fo,
      isCaptured: capturedTargetId.value === fo.id
    }));
  });

  watch(direction, (newDirection) => {
    const { azimuth, elevation } = newDirection;
    const direction = {
      x: -Math.cos(elevation) * Math.sin(azimuth),
      y: Math.sin(elevation),
      z: -Math.cos(elevation) * Math.cos(azimuth)
    };
    socketClient.send("update_direction", {
      direction
    });
  })

  socketClient.listenToEvent("mission_environment", (data) => {
    map.value = data.mapName;
    aas.value = data.aas;
    aaId.value = data.yourAAId;
    aaPositions.value = data.aaPositions;
    isInitialized.value = true;
  });

  socketClient.listenToEvent("mission_aas_update", (aasData) => {
    aas.value = aasData;
  });

  socketClient.listenToEvent("mission_update", (update) => {
    flightObjects.value = update.flightObjects;
  });

  socketClient.listenToEvent('captured_target', (id) => {
    if (capturedTargetId.value === id) return;
    capturedTargetId.value = id;
  })

  socketClient.listenToEvent("error", (error) => {
    notifications.openNotification({
      title: "Error",
      text: error,
      type: "error",
    });
  });



  function fireTarget() {
    if (!aaId.value) return;
    socketClient.send("fire_target", undefined);
  }

  return {
    fireTarget,
    isInitialized,
    map,
    aas,
    aaPositions,
    currentAA,
    parsedFlightObjects,
    direction,
  };
});
