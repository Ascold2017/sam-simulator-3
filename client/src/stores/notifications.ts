import { ref } from 'vue';
import { defineStore } from 'pinia';

interface Notification {
  id: number;
  title: string;
  text: string;
  type: 'success' | 'info' | 'error';
}

export const useNotificationStore = defineStore('notification', () => {
  const notifications = ref<Notification[]>([]);
  const nextId = ref(1);

  const openNotification = ({ title, text, type }: Omit<Notification, 'id'>) => {
    const id = nextId.value++;
    notifications.value.push({ id, title, text, type });

    // Удаляем уведомление через 4 секунды
    setTimeout(() => {
      closeNotification(id);
    }, 4000);
  };

  const closeNotification = (id: number) => {
    notifications.value = notifications.value.filter(notif => notif.id !== id);
  };

  return {
    notifications,
    openNotification,
    closeNotification,
  };
});
