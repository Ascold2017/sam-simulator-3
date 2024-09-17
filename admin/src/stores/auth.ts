import { defineStore } from "pinia";
import { onMounted, ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
    const token = ref<string>(localStorage.getItem('token') || '');

    onMounted(() => {
        if (!token.value) {
            window.location.href = '/auth';
        }
    })

    function logout() {
        token.value = '';
        localStorage.removeItem('token');
        window.location.href = '/auth';
    }

    return {
        token,
        logout
    }   
})  