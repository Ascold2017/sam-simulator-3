import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { LoginResponse, RegisterResponse, type User } from '../../../shared/models/auth.model'
import { httpClient } from '../adapters/httpClient';

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('token'));
    const user = ref<User | null>(null);
    const isAuthenticated = ref(!!token.value);
    const router = useRouter();

    // Регистрация пользователя
    async function register(username: string, password: string) {
        try {
            const data = await httpClient.post<RegisterResponse>('/register', { username, password });
            token.value = data.token;
            user.value = data.user;
            isAuthenticated.value = true;
            localStorage.setItem('token', token.value);
            router.push({ name: 'start' });
        } catch (error) {
            console.error('Ошибка регистрации:', error);
            throw error;
        }
    };

    // Авторизация пользователя
    async function login(username: string, password: string) {
        try {
            const data = await httpClient.post<LoginResponse>('/login', { username, password });
            token.value = data.token;
            user.value = data.user;
            isAuthenticated.value = true;
            localStorage.setItem('token', token.value);
            router.push({ name: 'start' });
        } catch (error) {
            console.error('Ошибка авторизации:', error);
            throw error;
        }
    };

    // Выход пользователя
    function logout() {
        token.value = null;
        user.value = null;
        isAuthenticated.value = false;
        localStorage.removeItem('token');
        router.push({ name: 'auth' });
    };


    return {
        token,
        user,
        isAuthenticated,
        register,
        login,
        logout
    };
})