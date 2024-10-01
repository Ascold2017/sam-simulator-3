import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type {
  MissionID,
  MissionRoom,
  PlayerJoinedData,
} from "../models/sockets.model";
import { socketClient } from "../adapters/socketClient";
import { useRouter } from "vue-router";
import { useMissions } from "./missions";
import { useAuthStore } from "./auth";

export const useRooms = defineStore("rooms", () => {
  const router = useRouter();
  const missionsStore = useMissions();
  const authStore = useAuthStore();

  const rooms = ref<MissionRoom[]>([]);
  const currentRoom = ref<PlayerJoinedData | null>(null);
  const parsedCurrentRoom = computed(() => {
    if (!currentRoom.value) return null;
    const room = rooms.value.find((r) => r.id === currentRoom.value?.roomId);
    return {
      id: currentRoom.value.roomId,
      missionId: room?.missionId,
      endedAt: room?.endedAt,
    };
  });

  const parsedMissionRooms = computed(() => {
    return rooms.value.map((room) => ({
      id: room.id,
      name: missionsStore.missions.find((m) => m.id === room.missionId)?.name,
      endedAt: room.endedAt,
      users: room.users.map((u) => u.username),
    }));
  });

  socketClient.listenToEvent("mission_rooms", (data) => {
    rooms.value = data;
  });

  socketClient.listenToEvent(
    "mission_room_created",
    ({ id, missionId, endedAt, users }) => {
      rooms.value.push({
        id,
        missionId,
        endedAt,
        users,
      });
    }
  );

  socketClient.listenToEvent("player_joined", (data) => {
    if (data.user.id === authStore.user?.id) {
      currentRoom.value = data;
      router.push({
        name: "main",
      });
    }

    rooms.value = rooms.value.map((room) => {
      if (room.id === data.roomId) {
        room.users.push(data.user);
      }
      return room;
    });
  });

  socketClient.listenToEvent("player_leaved", (data) => {
    if (data.user.id === authStore.user?.id) {
      currentRoom.value = null;
      router.push({
        name: "start",
      });
    }

    rooms.value = rooms.value.map((room) => {
      if (room.id === data.roomId) {
        room.users = room.users.filter((u) => u.id !== data.user.id);
      }
      return room;
    });
  });

  socketClient.listenToEvent("room_deleted", (roomId) => {
    rooms.value = rooms.value.filter((room) => room.id !== roomId);
    if (roomId === currentRoom.value?.roomId) {
      currentRoom.value = null;
      router.push({
        name: "start",
      });
    }
  });

  function createRoom(missionId: MissionID) {
    socketClient.send("create_mission_room", missionId);
  }

  function joinRoom(roomId: string) {
    socketClient.send("join_mission_room", roomId);
  }

  function leaveRoom() {
    if (currentRoom.value) {
      socketClient.send("leave_mission_room", currentRoom.value.roomId);
    }
  }

  function deleteRoom(roomId: string) {
    socketClient.send("delete_mission_room", roomId);
  }

  return {
    rooms,
    parsedMissionRooms,
    currentRoom,
    parsedCurrentRoom,
    createRoom,
    joinRoom,
    deleteRoom,
    leaveRoom,
  };
});
