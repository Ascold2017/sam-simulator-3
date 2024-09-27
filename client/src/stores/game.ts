import { defineStore } from "pinia";
import { socketClient } from "../adapters/socketClient";
import { computed, onMounted, ref, watch } from "vue";
import { useNotificationStore } from "./notifications";
import {
  AAState,
  MissileState,
  MissionData,
  TargetNPCState,
} from "../models/sockets.model";
import { useTargets } from "./targets";
import type { Target } from "../models/target.model";
import { Vector3 } from "three";

export interface ParsedTargetNPCState extends TargetNPCState {
  targetEntity: Target | null;
  isCaptured: boolean;
}
export const useGameStore = defineStore("game", () => {
  const targetStore = useTargets();
  const notifications = useNotificationStore();

  const map = ref<MissionData["mapName"]>("");

  const aaId = ref<string | null>(null);

  const aas = ref<AAState[]>([]);
  const targetNPCs = ref<TargetNPCState[]>([]);
  const missiles = ref<MissileState[]>([]);

  const viewMode = ref<"search" | "capture">("search");
  const direction = ref<{ azimuth: number; elevation: number }>({
    azimuth: 0,
    elevation: 0,
  });
  const isInitialized = ref(false);

  const currentAA = computed(() => {
    return aas.value.find((aa) => aa.id === aaId.value);
  });

  const parsedTargetNPCs = computed<ParsedTargetNPCState[]>(() => {
    return targetNPCs.value.map((fo) => ({
      ...fo,
      targetEntity: targetStore.targets.find((t) => t.id === fo.entityId),
      isCaptured: currentAA.value?.capturedTargetId === fo.id,
    }));
  });

  const capturedTarget = computed(() => {
    return parsedTargetNPCs.value.find(
      (t) => t.id === currentAA.value?.capturedTargetId
    );
  });

  const parsedCapturedTarget = computed(() => {
    if (!capturedTarget.value) return null;
    return {
      distance: new Vector3(...currentAA.value.position).sub(new Vector3(...capturedTarget.value.position)).length(),
      speed: new Vector3(...capturedTarget.value.velocity).length(),
      altitude: capturedTarget.value.position[1],
    }
  })

  watch(direction, (newDirection) => {
    const { azimuth, elevation } = newDirection;
    const direction = {
      x: -Math.cos(elevation) * Math.sin(azimuth),
      y: Math.sin(elevation),
      z: -Math.cos(elevation) * Math.cos(azimuth),
    };
    socketClient.send("update_direction", {
      direction,
    });
  });

  onMounted(() => {
    targetStore.getTargets();
  });

  socketClient.listenToEvent("mission_environment", (data) => {
    map.value = data.mapName;
    aaId.value = data.yourAAId;
    isInitialized.value = true;
  });

  socketClient.listenToEvent("update_world_state", (update) => {
    aas.value = update.filter((e) => e.type === "aa") as AAState[];
    targetNPCs.value = update.filter(
      (e) => e.type === "target-npc"
    ) as TargetNPCState[];
    missiles.value = update.filter(
      (e) => e.type === "missile"
    ) as MissileState[];
  });

  socketClient.listenToEvent("target_killed", (target) => {
    notifications.openNotification({
      title: "Target killed",
      text:
        targetStore.targets.find((t) => t.id === target.entityId)?.name ??
        "Unknown target",
      type: "info",
    });
  });

  socketClient.listenToEvent("missile_over_distance", (missile) => {
    if (currentAA.value?.launchedMissileIds?.includes(missile.id)) {
      notifications.openNotification({
        title: "Missile over distance",
        text: null,
        type: "error",
      });
    }
  });

  socketClient.listenToEvent("missile_overloaded", (missile) => {
    if (currentAA.value?.launchedMissileIds?.includes(missile.id)) {
      notifications.openNotification({
        title: "Missile overloaded",
        text: null,
        type: "error",
      });
    }
  });

  socketClient.listenToEvent("error", (error) => {
    notifications.openNotification({
      title: "Error",
      text: error,
      type: "error",
    });
  });

  window.addEventListener("keypress", (e) => {
    if (e.code === "KeyX") {
      resetTarget();
    }
    if (e.code === "KeyC") {
      captureTarget();
    }
    if (e.code === "Space") {
      fireTarget();
    }
  });

  function fireTarget() {
    if (!aaId.value) return;
    socketClient.send("fire_target", 'default');
  }

  function captureTarget() {
    if (!aaId.value) return;
    viewMode.value = "capture";
    socketClient.send("capture_target", undefined);
  }

  function resetTarget() {
    if (!aaId.value) return;
    viewMode.value = "search";
    socketClient.send("reset_target", undefined);
  }

  watch(capturedTarget, (target) => {
    if (target) {
      const aaPosition = currentAA.value.position; // Позиция зенитки
      const targetPosition = target.position; // Позиция цели

      // Разница в координатах
      const dx = aaPosition[0] - targetPosition[0];
      const dy = aaPosition[1] - targetPosition[1];
      const dz = aaPosition[2] - targetPosition[2];

      // Вычисляем азимут (угол поворота по горизонтали)
      const azimuth = Math.atan2(dx, dz) % (2 * Math.PI);

      // Вычисляем угол возвышения (угол по вертикали)
      const distance = Math.sqrt(dx * dx + dz * dz); // Горизонтальное расстояние
      const elevation = -Math.atan2(dy, distance);

      // Обновляем direction для захваченной цели
      direction.value = {
        azimuth: azimuth < 0 ? azimuth + 2 * Math.PI : azimuth,
        elevation,
      };
    }
  });

  return {
    fireTarget,
    captureTarget,
    resetTarget,
    isInitialized,
    map,
    aas,
    currentAA,
    parsedCapturedTarget,
    parsedTargetNPCs,
    missiles,
    direction,
    viewMode,
  };
});
