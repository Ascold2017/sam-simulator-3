<template>
  <TopBar />
  <GUI />
  <Suspense>
    <LoadIndicator />
  </Suspense>
  <Suspense>
    <Scene />
  </Suspense>
  <ActionBar />
</template>

<script setup lang="ts">
import Scene from './components/Scene/index.vue';
import TopBar from './components/TopBar.vue';
import GUI from './components/GUI.vue'
import LoadIndicator from './components/LoadIndicator.vue';
import ActionBar from './components/ActionBar.vue';
import { onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRooms } from '../../stores/rooms';
import { useGameStore } from '../../stores/game';

const roomStore = useRooms();
const router = useRouter()
const gameStore = useGameStore();

onMounted(() => {
  if (!roomStore.currentRoom) {
    router.push({ name: 'start' })
  }

  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  }

  // @ts-ignore
  if (screen?.orientation?.lock) {
    try {
      // @ts-ignore
      screen.orientation.lock('landscape')
    } catch (e) {
      console.error(e)
    }
  }
})

onBeforeUnmount(() => {
  if (document.fullscreenElement && document.exitFullscreen) {
    document.exitFullscreen();
  }
  gameStore.$reset();
});
</script>