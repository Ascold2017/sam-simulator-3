<template>
    <div class="auth-page">
        <div class="flip-card" :class="{ flipped: isFlipped }">
            <!-- Лицевая сторона (Логин) -->
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <div class="auth-card">
                        <h2 class="text-xl font-semibold mb-4">Логин</h2>
                        <form @submit.prevent="handleSubmit">
                            <input v-model="username" type="text" placeholder="Имя пользователя" class="input"
                                required />
                            <input v-model="password" type="password" placeholder="Пароль" class="input" required />
                            <button type="submit" class="btn-primary mt-4">Войти</button>
                        </form>
                        <p class="mt-4">
                            Нет аккаунта?
                            <button @click="toggleCard" class="link-button">Регистрация</button>
                        </p>
                    </div>
                </div>

                <!-- Обратная сторона (Регистрация) -->
                <div class="flip-card-back">
                    <div class="auth-card">
                        <h2 class="text-xl font-semibold mb-4">Регистрация</h2>
                        <form @submit.prevent="handleSubmit">
                            <input v-model="username" type="text" placeholder="Имя пользователя" class="input"
                                required />
                            <input v-model="password" type="password" placeholder="Пароль" class="input" required />
                            <button type="submit" class="btn-primary mt-4">Зарегистрироваться</button>
                        </form>
                        <p class="mt-4">
                            Уже есть аккаунт?
                            <button @click="toggleCard" class="link-button">Логин</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth';

const isFlipped = ref(false);
const authStore = useAuthStore();

// Общие переменные для логина и регистрации
const username = ref('');
const password = ref('');

// Переключение карточки
const toggleCard = () => {
    isFlipped.value = !isFlipped.value;
};

// Управление отправкой формы для логина или регистрации
const handleSubmit = async () => {
    try {
        if (isFlipped.value) {
            // Регистрация
            await authStore.register(username.value, password.value);
        } else {
            // Логин
            await authStore.login(username.value, password.value);
        }
    } catch (error) {
        console.error('Ошибка:', error);
    }
};
</script>

<style scoped>
.auth-page {
    @apply flex justify-center items-center h-screen;
}


.flip-card {
    @apply w-80 h-80;
    perspective: 1000px;
}

.flip-card-inner {
    @apply relative w-full h-full transition-transform duration-700;
    transform-style: preserve-3d;
}

.flipped .flip-card-inner {
    transform: rotateY(180deg);

}

.flip-card-front,
.flip-card-back {
    @apply absolute w-full h-full flex flex-col justify-center items-center;
    backface-visibility: hidden;
}

.flip-card-front {
    @apply bg-white;
}

.flip-card-back {
    @apply bg-white;
    transform: rotateY(180deg)
}

.auth-card {
    @apply w-full p-6 text-center shadow-lg rounded-lg;
}

.input {
    @apply w-full p-2 my-2 border border-gray-300 rounded-lg;
}

.btn-primary {
    @apply w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600;
}

.link-button {
    @apply text-blue-500 cursor-pointer underline hover:text-blue-600;
}
</style>