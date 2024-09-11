<template>
    <div class="profile-page">

        <!-- Хедер с информацией о пользователе -->
        <header class="profile-header">
            <h2 class="profile-header__title">AA Simulator</h2>
            
            <router-link class="logout-button" :to="{ name: 'start' }">Rooms</router-link>
        </header>

        <section class="profile-info card">
            <p><strong>ID:</strong> #{{ user?.id }}</p>
            <p><strong>Username:</strong> {{ user?.username }}</p>
            <button class="logout-button" @click="logout">Logout</button>
        </section>

        <!-- Карусель зениток -->
        <div class="aa-carousel card">
            <h3><strong>Anti-aircraft units</strong></h3>
            <swiper :slides-per-view="1">
                <swiper-slide v-for="aa in aaStore.aas" :key="aa.id">
                    <AAInfoCard :aa="aa" :is-highlighted="user?.aa.id === aa.id" />
                </swiper-slide>
            </swiper>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue'; // Импорт компонентов Swiper
import 'swiper/swiper-bundle.css'; // Импорт стилей Swiper
import { useAuthStore } from '../../stores/auth';
import { useAAs } from '../../stores/aas';
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import AAInfoCard from './components/AAInfoCard.vue';

const authStore = useAuthStore();
const aaStore = useAAs();
const { user } = storeToRefs(authStore)

// Функция для логаута
const logout = () => {
    authStore.logout();
};

onMounted(() => {
    aaStore.getAAs();
})
</script>

<style scoped>
.profile-page {
    @apply flex flex-col items-center p-5 max-w-4xl mx-auto;
}

.profile-header {
    @apply fixed top-0 left-0 right-0 flex items-center justify-between px-6 py-4 bg-black bg-opacity-70 text-white z-10;
}

.profile-header__title {
    @apply text-4xl font-bold;
}

.logout-button {
    @apply px-4 py-2 bg-red-500 text-white rounded cursor-pointer;
}

.card {
    @apply bg-white shadow-lg rounded-lg p-6 w-full max-w-md;
}

.profile-info {
    @apply mt-20 w-full;
}


.aa-carousel {
    @apply mt-4 w-full;
}

.swiper {
    @apply w-full h-full;
}

.swiper-slide {
    @apply flex justify-center items-center p-4;
}
</style>