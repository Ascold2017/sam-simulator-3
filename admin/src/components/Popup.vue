<template>
    <div class="popup-overlay" @click.self="closePopup">
      <div class="popup-content">
        <header class="popup-header">
          <slot name="header">Popup Title</slot>
          <button class="popup-close-btn" @click="closePopup">×</button>
        </header>
  
        <div class="popup-body">
          <slot name="content">Popup Content</slot>
        </div>
  
        <footer class="popup-footer">
          <slot name="footer">
            <button @click="closePopup" class="popup-close-btn">Close</button>
          </slot>
        </footer>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineEmits } from 'vue';
  
  const emit = defineEmits(['close']);
  
  const closePopup = () => {
    emit('close');
  };
  </script>
  
  <style scoped>
  .popup-overlay {
    @apply fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50;
  }
  
  .popup-content {
    @apply bg-white p-6 rounded-lg w-96 relative shadow-lg;
  }
  
  .popup-header {
    @apply flex justify-between items-center mb-4;
  }
  
  .popup-body {
    @apply mb-4;
  }
  
  .popup-footer {
    @apply flex justify-end space-x-2;
  }
  
  .popup-close-btn {
    @apply text-xl bg-transparent hover:text-red-500 cursor-pointer;
  }
  </style>
  