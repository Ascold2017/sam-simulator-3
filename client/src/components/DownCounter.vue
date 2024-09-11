<template>
    <span>{{ minutes }}:{{ seconds }}</span>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue';
  
  const props = defineProps<{ endDate: number }>();
  
  // Рефы для хранения оставшегося времени
  const minutes = ref(0);
  const seconds = ref(0);
  
  let interval: number | undefined;
  
  const updateCountdown = () => {
    const now = Date.now();
    const timeLeft = props.endDate - now;
  
    if (timeLeft <= 0) {
      minutes.value = 0;
      seconds.value = 0;
      clearInterval(interval);
      return;
    }

    minutes.value = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    seconds.value = Math.floor((timeLeft % (1000 * 60)) / 1000);
  };
  
  onMounted(() => {
    updateCountdown();
    interval = window.setInterval(updateCountdown, 1000);
  });
  
  onUnmounted(() => {
    clearInterval(interval);
  });
  </script>
  