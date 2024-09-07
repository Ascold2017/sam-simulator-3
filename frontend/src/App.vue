<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { useRooms } from './stores/rooms';
import { onMounted } from 'vue';
import { useGameStore } from './stores/game';

const roomStore = useRooms();
useGameStore();
const router = useRouter()

onMounted(() => {
  if (!roomStore.currentRoom) {
    router.push({ name: 'start' })
  }
})
</script>

<template>
<div class="app-layout">
  <RouterView />
</div>
</template>

<style scoped>
.app-layout {
  @apply h-screen bg-contain bg-center bg-black bg-opacity-50;
  background-image: url('/background.jpg');
  background-repeat: repeat;
}
</style>