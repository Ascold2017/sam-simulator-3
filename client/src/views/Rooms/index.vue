<template>
    <div class="start-screen">
      <!-- Верхняя панель -->
      <div class="start-screen__top-bar">
        <h2 class="start-screen__top-bar-title">AA Simulator</h2>
        <router-link class="start-screen__top-bar-button" :to="{ name: 'profile' }">Profile</router-link>
      </div>
  
      <!-- Селектор для миссий и кнопка создания комнаты -->
      <div class="start-screen__mission-selector">
        <select v-model="selectedMissionId" class="start-screen__select">
          <option :value="null" disabled>Choose mission</option>
          <option v-for="mission in missions" :key="mission.id" :value="mission.id">
            {{ mission.name }}
          </option>
        </select>
        <button
          class="start-screen__button"
          @click="createMissionRoom"
          :disabled="!selectedMissionId"
        >
          New mission
        </button>
      </div>
  
      <!-- Таблица с комнатами -->
      <div v-if="parsedMissionRooms.length > 0">
        <table class="start-screen__table">
          <thead>
            <tr>
              <th>Mission</th>
              <th>Time left</th>
              <th>Joined players</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="room in parsedMissionRooms" :key="room.id">
              <td>{{ room.name }}</td>
              <td><DownCounter :end-date="room.endedAt"/></td>
              <td>{{ room.users.join(', ') }}</td>
              <td>
                <button class="start-screen__button" @click="joinRoom(room.id)">
                  Join
                </button>
                <button
                  class="start-screen__button start-screen__button--delete"
                  @click="deleteRoom(room.id)"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-else class="start-screen__no-rooms">No rooms yet</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRooms } from '../../stores/rooms';
  import { useMissions } from '../../stores/missions';
  import { storeToRefs } from 'pinia';
  import DownCounter from '../../components/DownCounter.vue';
  
  // Инициализация сторов
  const missionsStore = useMissions();
  const roomsStore = useRooms();
  
  // Получаем состояния через storeToRefs для реактивности
  const { parsedMissionRooms } = storeToRefs(roomsStore);
  const { missions } = storeToRefs(missionsStore);
  
  // Выбранная миссия
  const selectedMissionId = ref<number | null>(null);
  
  // Метод для создания комнаты
  const createMissionRoom = async () => {
    try {
      if (selectedMissionId.value) {
        await roomsStore.createRoom(selectedMissionId.value);
        selectedMissionId.value = null; // Сброс выбора миссии
      }
    } catch (error) {
      console.error('Ошибка при создании комнаты:', error);
    }
  };
  
  // Присоединение к комнате
  const joinRoom = (roomId: string) => {
    roomsStore.joinRoom(roomId);
  };
  
  // Удаление комнаты
  const deleteRoom = async (roomId: string) => {
    try {
      await roomsStore.deleteRoom(roomId);
    } catch (error) {
      console.error('Ошибка при удалении комнаты:', error);
    }
  };
  
  // При загрузке компонента загружаем миссии и комнаты
  onMounted(async () => {
    await missionsStore.getMissions();
  });
  </script>
  
  <style scoped>
  .start-screen {
    @apply flex flex-col items-center h-screen;
  }
  
  .start-screen__top-bar {
    @apply fixed top-0 left-0 right-0 flex justify-between px-6 py-4 bg-black bg-opacity-70 text-white z-10;
  }
  
  .start-screen__top-bar-title {
    @apply text-4xl font-bold;
  }
  
  .start-screen__top-bar-button {
    @apply px-4 py-2 bg-blue-500 text-white rounded mr-2 transition duration-200 ease-in-out hover:bg-blue-600;
  }
  
  .start-screen__mission-selector {
    @apply flex items-center space-x-4 mt-24 mb-8;
  }
  
  .start-screen__select {
    @apply px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500;
  }
  
  .start-screen__button {
    @apply px-4 py-2 bg-blue-500 text-white rounded transition duration-200 ease-in-out hover:bg-blue-600;
  }
  
  .start-screen__button--delete {
    @apply bg-red-500 hover:bg-red-600;
  }
  
  .start-screen__table {
    @apply table-auto border-collapse w-full max-w-4xl text-center mb-8 bg-white;
  }
  
  .start-screen__table th,
  .start-screen__table td {
    @apply border border-gray-300 px-4 py-2;
  }
  
  .start-screen__no-rooms {
    @apply text-lg text-gray-500 mt-8;
  }
  </style>
  