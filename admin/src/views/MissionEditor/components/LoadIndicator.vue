<template>
    <div v-if="progress < 100 && !hasFinishLoading" class="loading-indicator">
      <p>Loading... {{ progress }}%</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { useProgress } from '@tresjs/cientos';
  
  const { progress, hasFinishLoading } = await useProgress();
  </script>
  
  <style scoped>
  .loading-indicator {
    position: absolute;
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
  