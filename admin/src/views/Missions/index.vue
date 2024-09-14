<template>
  <div class="missions">
    <div class="missions__header">
      <h1 class="missions__title">Missions</h1>
      <router-link class="missions__create-btn" :to="{ name: 'missionCreate' }">Create mission</router-link>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Mission name</th>
          <th>Map</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="mission in missions" :key="mission.id">
          <td>{{ mission.id }}</td>
          <td>{{ mission.name }}</td>
          <td>{{ mission.map.name }}</td>
          <td>
            <router-link :to="{ name: 'missionEdit', params: { id: mission.id } }"
              class="missions__edit-btn mr-2">Edit</router-link>
            <button @click="missionsStore.deleteMission(mission.id)" class="missions__delete-btn">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useMissions } from '../../stores/missions';
import { storeToRefs } from 'pinia';

const missionsStore = useMissions();
const { missions } = storeToRefs(missionsStore)

onMounted(() => {
  missionsStore.getMissions()
})

</script>

<style scoped>
.missions {
  @apply p-4;
}

.missions__header {
  @apply flex justify-between items-center mb-4;
}

.missions__title {
  @apply text-2xl font-bold;
}

.missions__create-btn {
  @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600;
}

.missions__edit-btn {
  @apply text-white bg-green-500 hover:bg-green-600 px-2 py-1 rounded;
}

.missions__delete-btn {
  @apply text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded;
}
</style>