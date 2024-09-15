import { defineStore } from "pinia";
import { socketClient } from "../adapters/socketClient";
import { computed, ref } from "vue";
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
  const capturedTargets = ref<MissionUpdate["capturedTargets"]>([]);
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
      isCaptured: capturedTargets.value.some(
        (ct) => ct.targetId === fo.id && ct.aaId === aaId.value
      ),
    }));
  });

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

  socketClient.listenToEvent("mission_aas_positions_update", (update) => {
    aaPositions.value = update;
  });

  socketClient.listenToEvent("mission_update", (update) => {
    flightObjects.value = update.flightObjects;
    capturedTargets.value = update.capturedTargets;
  });

  socketClient.listenToEvent("error", (error) => {
    notifications.openNotification({
      title: "Error",
      text: error,
      type: "error",
    });
  });

  function selectCurrentAA(aaId: number) {
    socketClient.send("change_aa_position", aaId);
  }

  function captureTarget() {
    if (!aaId.value) return;
    socketClient.send("capture_target", {
      azimuth: direction.value.azimuth,
      elevation: direction.value.elevation,
    });
  }

  function fireTarget() {
    if (!aaId.value) return;
    socketClient.send("fire_target", {
      azimuth: direction.value.azimuth,
      elevation: direction.value.elevation,
    });
  }

  return {
    selectCurrentAA,
    captureTarget,
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
