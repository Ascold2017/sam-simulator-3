import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

export const useDevice = defineStore('device', () => {
    const isMobile = ref(false);
    const orientation = ref<'landscape' | 'portrait'>('landscape')


    function isMobileDevice(): boolean {
        return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Следим за изменением ориентации экрана
    onMounted(() => {
        isMobile.value = isMobileDevice()
    });

    return {
        isMobile,
        orientation
    }
})