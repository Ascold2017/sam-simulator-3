<template>
    <button class="map-button">
        <div class="map-button__azimuth" :style="{ transform: `rotate(${azimuth}rad)` }"></div>
        <img :src="minimapUrl" alt="Карта" class="map-button__image">
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGameStore } from '../../../stores/game';

const gameStore = useGameStore()

const azimuth = computed(() => gameStore.direction.azimuth)


const minimapUrl = computed(() => `${import.meta.env.VITE_APP_STATIC_URL}/models/${gameStore.map}/textures/minimap.jpeg`)
</script>

<style lang="css" scoped>
.map-button {
    @apply bg-white;
    border-radius: 50%;
    width: 200px;
    height: 200px;
    overflow: hidden;
    position: relative;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.map-button__azimuth {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 3px;
    height: 100px;
    background-color: red;
    transform-origin: 0 0;
    transform: rotate(0deg);
}
</style>