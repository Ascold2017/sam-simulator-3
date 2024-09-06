import { defineStore } from "pinia";
import { computed, ref } from "vue";
import type { MissionID, MissionRoom } from '../../../shared/models/sockets.model'
import { socketClient } from "../adapters/socketClient";
import { useRouter } from "vue-router";
import { useMissions } from "./missions";

export const useRooms = defineStore('rooms', () => {
    const router = useRouter();
    const missionsStore = useMissions()

    const rooms = ref<MissionRoom[]>([])
    const currentRoomId = ref<string | null>(null)

    const parsedMissionRooms = computed(() => {
        return rooms.value.map(room => ({
            id: room.id,
            name: missionsStore.missions.find(m => m.id === room.missionId)?.name
        }))
    })

    socketClient.listenToEvent('mission_rooms', (data) => {
        rooms.value = data;
    })

    socketClient.listenToEvent('mission_room_created', ({ id, missionId }) => {
        rooms.value.push({
            id,
            missionId
        })
    })

    socketClient.listenToEvent('player_joined', (roomId) => {
        currentRoomId.value = roomId;
        router.push({
            name: 'main'
        })
    })

    socketClient.listenToEvent('room_deleted', (roomId) => {
        rooms.value = rooms.value.filter(room => room.id !== roomId);
    })

    function createRoom(missionId: MissionID) {
        socketClient.send('create_mission_room', missionId);
    }

    function joinRoom(roomId: string) {
        socketClient.send('join_mission_room', roomId);
    }

    function leaveRoom() {
        if (currentRoomId.value) {
            socketClient.send('leave_mission_room', currentRoomId.value)
        }

    }

    function deleteRoom(roomId: string) {
        socketClient.send('delete_mission_room', roomId);
    }

    return {
        rooms,
        parsedMissionRooms,
        currentRoomId,
        createRoom,
        joinRoom,
        deleteRoom,
        leaveRoom
    }

})