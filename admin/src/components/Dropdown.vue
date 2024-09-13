<template>
    <div class="dropdown">
      <button class="dropdown-btn" @click="toggleDropdown">{{ buttonLabel }}</button>
      <div v-if="isOpen" class="dropdown-content">
        <slot name="body" />
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  
  const props = defineProps<{ buttonLabel: string }>();
  
  const isOpen = ref(false);
  
  const toggleDropdown = () => {
    isOpen.value = !isOpen.value;
  };
  </script>
  
  <style scoped>
  .dropdown {
    @apply relative inline-block;
  }
  
  .dropdown-btn {
    @apply bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600;
  }
  
  .dropdown-content {
    @apply absolute bg-white shadow-lg rounded-lg mt-2 py-2 px-2 z-10 w-full;
  }
  </style>
  