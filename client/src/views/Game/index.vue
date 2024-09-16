<template>
  <TopBar />
  <Suspense>
    <Scene />
  </Suspense>

  <AimGUI />
  <ActionBar />
</template>

<script setup lang="ts">
import Scene from './components/Scene/index.vue';
import TopBar from './components/TopBar.vue';
import AimGUI from './components/AimGUI.vue'
import ActionBar from './components/ActionBar.vue';
import { onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRooms } from '../../stores/rooms';

const roomStore = useRooms();
const router = useRouter()
onMounted(() => {
  if (!roomStore.currentRoom) {
    router.push({ name: 'start' })
  }

  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }
})

onBeforeUnmount(() => {
  if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen();
  }
});
</script>