<template>
  <TopBar />
  <div class="container" :class="{ 'container_mobile': device.isMobile && device.orientation === 'landscape' }">
  <div class="scene-container" :class="{ 'scene-container_mobile': device.isMobile }">
    <Suspense>
      <Scene />
    </Suspense>

    <AimGUI />

  </div>
  <ActionBar />
</div>
</template>

<script setup lang="ts">
import Scene from './components/Scene/index.vue';
import TopBar from './components/TopBar.vue';
import AimGUI from './components/AimGUI.vue'
import ActionBar from './components/ActionBar.vue';
import { onBeforeUnmount, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useRooms } from '../../stores/rooms';
import { useDevice } from '../../stores/device';

const roomStore = useRooms();
const router = useRouter()
const device = useDevice()
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


<style lang="css" scoped>
.scene-container {

  position: relative;
  height: 100vh;
}

.scene-container_mobile {
  height: 100vmin;
  width: 100vmin;
  aspect-ratio: 1;
}

.container {
  @apply flex flex-col h-screen;
}

.container_mobile {
  @apply flex-row;
}
</style>