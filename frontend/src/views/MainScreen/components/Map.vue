<template>
    <button class="map-button" :style="{ transform: `rotate(${azimuth}deg)` }" @click="isShowMap = true">
        <img src="https://placehold.co/200" alt="Карта" class="map-button__image">
    </button>

    <div class="map-popup" v-if="isShowMap">

        <div class="map-container">
            <img src="https://placehold.co/600x600" alt="Карта" class="map-image">
            <span v-for="aa in missionStore.aaPositions" :key="aa.id"
                :class="['map-aa', { 'map-aa_current': aa.aaId === missionStore.currentAA.id }]" :style="getAAStyle(aa)"
                @click="missionStore.selectCurrentAA(aa.id)">
                ▲
            </span>
        </div>
        <button class="close-button" @click="isShowMap = false">
            <i class="material-icons">expand_more</i>
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCameraStore } from '../../../stores/camera';
import { ref } from 'vue';
import { useMissionStore } from '../../../stores/mission';

const missionStore = useMissionStore()
const cameraStore = useCameraStore()

const isShowMap = ref(false);

const azimuth = computed(() => cameraStore.azimuth * (180 / Math.PI))

// Функция для получения стилей для зениток
const getAAStyle = (aa: any) => {
    const mapSizeKm = 1; // Размер карты в километрах
    const mapSizeMeters = mapSizeKm * 1000; // Размер карты в метрах
    const halfMapSizeMeters = mapSizeMeters / 2; // Половина карты в метрах

    // Переводим координаты в проценты от размера карты
    const xPercent = ((aa.position.x + halfMapSizeMeters) / mapSizeMeters) * 100;
    const zPercent = ((-aa.position.z + halfMapSizeMeters) / mapSizeMeters) * 100; // Учитываем, что ось z направлена вверх

    return {
        left: `${xPercent}%`,
        top: `${zPercent}%`,
    };
};
</script>

<style lang="css" scoped>
.map-button {
    @apply bg-white;
    border-radius: 50%;
    width: 200px;
    height: 200px;
    overflow: hidden;
}

.map-popup {
    @apply fixed top-0 left-0 bottom-0 right-0 bg-gray-500 flex flex-col items-center justify-center;
    z-index: 1;
}

.map-container {
    @apply bg-white relative;
    width: 80%;
    max-width: 600px;
    aspect-ratio: 1/1;
    /* Задает соотношение сторон 1:1 для квадратной карты */
    display: flex;
    align-items: center;
    justify-content: center;
}

.map-image {
    @apply w-full h-full object-cover;
}

.map-aa {
    @apply absolute text-blue-500;
    font-size: 24px;
    transform: translate(-50%, -50%);
    cursor: pointer;
}

.map-aa_current {
    @apply text-red-500;
}

.close-button {
    @apply block w-full;

}

.close-button i {
    font-size: 48px;
}
</style>