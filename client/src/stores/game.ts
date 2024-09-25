import { defineStore } from "pinia";
import { socketClient } from "../adapters/socketClient";
import { computed, onMounted, ref, watch } from "vue";
import { useNotificationStore } from "./notifications";
import { AAState, MissileState, MissionData, TargetNPCState } from "../models/sockets.model";
import { useTargets } from "./targets";
import type { Target } from "../models/target.model";

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

  const viewMode = ref<'search' | 'capture'>('search');
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
      targetEntity: targetStore.targets.find(t => t.id === fo.entityId),
      isCaptured: true
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

  onMounted(() => {
    targetStore.getTargets()
  })

  socketClient.listenToEvent("mission_environment", (data) => {
    map.value = data.mapName;
    aaId.value = data.yourAAId;
    isInitialized.value = true;
  });


  socketClient.listenToEvent('update_world_state', (update) => {
    aas.value = update.filter(e => e.type === 'aa') as AAState[];
    targetNPCs.value = update.filter(e => e.type === 'target-npc') as TargetNPCState[];
    missiles.value = update.filter(e => e.type === 'missile') as MissileState[];
  });

  socketClient.listenToEvent('target_killed', target => {
    notifications.openNotification({
      title: "Target killed",
      text: targetStore.targets.find(t => t.id === target.entityId)?.name ?? 'Unknown target',
      type: "info",
    })
  })

  socketClient.listenToEvent("error", (error) => {
    notifications.openNotification({
      title: "Error",
      text: error,
      type: "error",
    });
  });

  window.addEventListener('keypress', (e) => {
    if (e.code === 'KeyX') {
      viewMode.value = 'search'
    }
    if (e.code === 'KeyC') {
      viewMode.value = 'capture'
    }
    if (e.code === 'Space') {
      fireTarget()
    }
  })



  function fireTarget() {
    if (!aaId.value) return;
    socketClient.send("fire_target", undefined);
  }

  return {
    fireTarget,
    isInitialized,
    map,
    aas,
    currentAA,
    parsedTargetNPCs,
    missiles,
    direction,
    viewMode,
  };
});
