import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

export const useDevice = defineStore('device', () => {
    const isMobile = ref(false);
    const orientation = ref<'landscape' | 'portrait'>('landscape')

    function handleOrientationChange() {
        if (window.orientation === 0 || window.orientation === 180) {
            orientation.value = 'portrait';
        } else {
            orientation.value = 'landscape';
        }
    }

    function isMobileDevice(): boolean {
        return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    // Следим за изменением ориентации экрана
    onMounted(() => {
        window.addEventListener('orientationchange', handleOrientationChange);
        // Инициализируем начальную ориентацию
        handleOrientationChange();

        isMobile.value = isMobileDevice()
    });

    return {
        isMobile,
        orientation
    }
})