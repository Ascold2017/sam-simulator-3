<template>
    <div class="notifications">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="['notification', `notification--${notification.type}`]"
      >
        <strong class="notification__title">{{ notification.title }}</strong>
        <p class="notification__text">{{ notification.text }}</p>
        <button @click="close(notification.id)" class="notification__close">Close</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import { useNotificationStore } from '../stores/notifications';
  
  const store = useNotificationStore();
  
  const notifications = computed(() => store.notifications);
  
  const close = (id: number) => {
    store.closeNotification(id);
  };
  </script>
  
  <style scoped>
  .notification {
    @apply p-4 rounded shadow-lg mb-4;
  }
  
  .notification--success {
    @apply bg-green-200 text-green-800;
  }
  
  .notification--info {
    @apply bg-blue-200 text-blue-800;
  }
  
  .notification--error {
    @apply bg-red-200 text-red-800;
  }
  
  .notification__title {
    @apply font-bold;
  }
  
  .notification__text {
    @apply mb-2;
  }
  
  .notification__close {
    @apply text-red-500;
  }
  
  .notifications {
    @apply fixed top-0 right-0 p-4 space-y-4;
  }
  </style>
  