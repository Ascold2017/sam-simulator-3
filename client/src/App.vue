<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useGameStore } from './stores/game';
import { useRooms } from './stores/rooms';
import Notifications from './components/Notifications.vue';

useRooms()
useGameStore();
</script>

<template>
<div class="app-layout">
  <RouterView />
  <Notifications />
</div>
</template>

<style scoped>
.app-layout {
  @apply h-screen bg-contain bg-center bg-black bg-opacity-50;
  background-image: url('/background.jpg');
  background-repeat: repeat;
}
</style>