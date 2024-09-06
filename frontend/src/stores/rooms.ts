import { defineStore } from "pinia";
import { ref } from "vue";
import type { MissionID, MissionRoom } from '../../../shared/models/sockets.model'
import { socketClient } from "../adapters/socketClient";
import { useRouter } from "vue-router";

export const useRooms = defineStore('rooms', () => {
    const router = useRouter();

    const rooms = ref<MissionRoom[]>([])
    const currentMissionId = ref<number | null>(null)

    socketClient.listenToEvent('mission_rooms', (data) => {
        rooms.value = data;
    })

    socketClient.listenToEvent('mission_room_created', (missionId) => {
        rooms.value = rooms.value.map(room => ({
            ...room,
            isCreated: room.id === missionId ? true : room.isCreated
        }))
    })

    socketClient.listenToEvent('player_joined', (missionId) => {
        currentMissionId.value = missionId;
        router.push({
            name: 'main'
        })
    })

    socketClient.listenToEvent('room_deleted', (missionId) => {
        rooms.value = rooms.value.map(room => ({
            ...room,
            isCreated: room.id === missionId ? false : room.isCreated
        }))
    })

    function createRoom(missionId: MissionID) {
        socketClient.send('create_mission_room', missionId);
    }

    function joinRoom(missionId: MissionID) {
        socketClient.send('join_mission_room', missionId);
    }

    function leaveRoom() {
        if (currentMissionId.value) {
            socketClient.send('leave_mission_room', currentMissionId.value)
        }
        
    }

    function deleteRoom(missionId: MissionID) {
        socketClient.send('delete_mission_room', missionId);
    }

    return {
        rooms,
        currentMissionId,
        createRoom,
        joinRoom,
        deleteRoom,
        leaveRoom
    }

})