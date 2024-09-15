<template>
    <div class="aim-target" :class="{ 'aim-target_landscape': device.orientation === 'landscape' }"
        :style="aimTargetStyle" @click="gameStore.captureTarget" @contextmenu.prevent="gameStore.fireTarget">
        <span class="aim-target__elevation">{{ elevation.toFixed(0) }}*</span>
        <svg class="aim-target__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <!-- Верхний левый угол -->
            <line x1="3" y1="8" x2="3" y2="3" stroke="red" stroke-width="0.5" />
            <line x1="3" y1="3" x2="8" y2="3" stroke="red" stroke-width="0.5" />

            <!-- Верхний правый угол -->
            <line x1="16" y1="3" x2="21" y2="3" stroke="red" stroke-width="0.5" />
            <line x1="21" y1="3" x2="21" y2="8" stroke="red" stroke-width="0.5" />

            <!-- Нижний левый угол -->
            <line x1="3" y1="16" x2="3" y2="21" stroke="red" stroke-width="0.5" />
            <line x1="3" y1="21" x2="8" y2="21" stroke="red" stroke-width="0.5" />

            <!-- Нижний правый угол -->
            <line x1="16" y1="21" x2="21" y2="21" stroke="red" stroke-width="0.5" />
            <line x1="21" y1="21" x2="21" y2="16" stroke="red" stroke-width="0.5" />
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

const cameraFov = 75;
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
    @apply fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer;
    aspect-ratio: 1;
}

.aim-target__azimuth {
    @apply text-red-500 absolute left-1/2 transform -translate-x-1/2;
    bottom: -10px;
}

.aim-target__elevation {
    @apply text-red-500 absolute top-1/2 transform -translate-y-1/2;
    right: -10px;

}
</style>