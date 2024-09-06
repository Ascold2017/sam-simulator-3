<template>
    <div class="start-screen">
        <h1 class="start-screen__title">AA Simulator</h1>

        <!-- Селектор для выбора миссии и кнопка создания комнаты -->
        <div class="start-screen__mission-selector">
            <select v-model="selectedMissionId" class="start-screen__select">
                <option v-for="room in availableRooms" :key="room.id" :value="room.id">
                    {{ room.name }}
                </option>
            </select>
            <button class="start-screen__button" @click="createMissionRoom" :disabled="!selectedMissionId">
                Create Mission
            </button>
        </div>

        <!-- Таблица с созданными комнатами -->
        <table class="start-screen__table">
            <thead>
                <tr>
                    <th>Mission Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="room in createdRooms" :key="room.id">
                    <td>{{ room.name }}</td>
                    <td>
                        <button class="start-screen__button" @click="roomsStore.joinRoom(room.id)">
                            Join
                        </button>
                        <button class="start-screen__button start-screen__button--delete" @click="roomsStore.deleteRoom(room.id)">
                            Delete
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRooms } from '../../stores/rooms';
import { storeToRefs } from 'pinia';

// Подключаем Pinia store для работы с комнатами
const roomsStore = useRooms();
const { rooms } = storeToRefs(roomsStore)

// Состояние для выбранной миссии
const selectedMissionId = ref<number | null>(null);

// Создание computed для фильтрации доступных миссий и созданных комнат
const availableRooms = computed(() => rooms.value.filter(room => !room.isCreated)); // Доступные комнаты (не созданные)
const createdRooms = computed(() => rooms.value.filter(room => room.isCreated)); // Созданные комнаты

// Метод для создания комнаты
function createMissionRoom() {
    if (selectedMissionId.value !== null) {
        roomsStore.createRoom(selectedMissionId.value);
        selectedMissionId.value = null; // Сбрасываем выбранную миссию после создания
    }
}
</script>

<style scoped>
.start-screen {
    @apply flex flex-col items-center justify-center h-screen;
}

.start-screen__title {
    @apply text-4xl mb-8;
}

.start-screen__mission-selector {
    @apply flex items-center space-x-4 mb-8;
}

.start-screen__select {
    @apply px-4 py-2 border border-gray-300 rounded;
}

.start-screen__table {
    @apply table-auto border-collapse mb-8;
}

.start-screen__table th,
.start-screen__table td {
    @apply border border-gray-300 px-4 py-2 text-center;
}

.start-screen__button {
    @apply px-4 py-2 bg-blue-500 text-white rounded;
}

.start-screen__button--delete {
    @apply bg-red-500;
}
</style>