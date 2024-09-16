<template>
  <div v-if="progress < 100 && !hasFinishLoading && !isLoaded" class="loading-indicator">
    <p>Loading... {{ progress }}%</p>
  </div>
</template>

<script setup lang="ts">
import { useProgress } from '@tresjs/cientos';
import { ref, watch } from 'vue';
const isLoaded = ref(false)
const { progress, hasFinishLoading } = await useProgress();

watch(hasFinishLoading, (v) => {
  if (v) {
    isLoaded.value = true
  }

})
</script>

<style scoped>
.loading-indicator {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  font-size: 40px;
  z-index: 99999;
  color: white;
  background-color: rgba(0, 0, 0, 0.99);
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

}
</style>