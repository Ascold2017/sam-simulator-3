<template>
    <div class="aim-target" :class="{ 'aim-target_landscape': device.orientation === 'landscape' }"
        :style="aimTargetStyle" @click="gameStore.captureTarget" @contextmenu.prevent="gameStore.fireTarget">
        <span class="aim-target__elevation">{{ elevation.toFixed(0) }}*</span>
        <svg class="aim-target__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="red" stroke-dasharray="2" stroke-width="0.5" fill="transparent" />
        </svg>
        <span class="aim-target__azimuth">{{ azimuth.toFixed(0) }}*</span>
    </div>

</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDevice } from '../../../stores/device';
import { useGameStore } from '../../../stores/game';

const device = useDevice()
const gameStore = useGameStore()

const cameraFov = 60;
const viewAngle = computed(() => gameStore.currentAA?.viewAngle || 0)
const azimuth = computed(() => gameStore.direction.azimuth * (180 / Math.PI))
const elevation = computed(() => gameStore.direction.elevation * (180 / Math.PI))

// Расчет размера рамки прицела
const aimTargetStyle = computed(() => {
    const viewAngleDeg = viewAngle.value * (180 / Math.PI); // Преобразуем viewAngle в градусы
    const sizePercentage = (viewAngleDeg / cameraFov) * 100; // Размер рамки относительно FOV

    return {
        width: `${sizePercentage}%`,
    };
});
</script>

<style scoped>
.aim-target {
    @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer;
    aspect-ratio: 1;
}

.aim-target__azimuth {
    @apply text-red-500 absolute left-1/2 transform -translate-x-1/2 text-2xl font-bold;
    bottom: -20px;
}

.aim-target__elevation {
    @apply text-red-500 absolute top-1/2 transform -translate-y-1/2 text-2xl font-bold;
    right: -25px;

}
</style>