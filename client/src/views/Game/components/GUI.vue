<template>
    <div class="gui">
        <!-- Missiles info bar -->
        <div class="gui__missiles" v-if="gameStore.currentAA">
            <span class="gui__missile-count" :class="{ 'almost-empty': gameStore.currentAA.ammoCount <= 1 }">AMMO: {{
                gameStore.currentAA.ammoCount }}</span> *
            <div class="gui__missile-status" :class="{ 'not-ready': !gameStore.currentAA.readyToFire }">READY</div>
        </div>
        <!-- Azimuth and elevation -->
        <span class="gui__azimuth">
            {{ azimuth.toFixed(0) }}°
        </span>
        <span class="gui__elevation">{{ elevation.toFixed(0) }}°</span>

        <!-- Capture rectangle -->
        <div class="gui__capture-rect" v-if="isCaptured">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect x="0" y="0" width="24" height="24" stroke="rgb(255, 0, 0)" fill="none" stroke-width="1"
                    stroke-dasharray="12" stroke-dashoffset="6" />
            </svg>
        </div>
        <!-- Search rectangle -->
        <div class="gui__search-rect" v-else :style="aimTargetStyle">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect x="0" y="0" width="24" height="24" stroke="rgb(21, 128, 61)" fill="none" stroke-width="1"
                    stroke-dasharray="12" stroke-dashoffset="6" />
            </svg>
        </div>

        <div class="gui__target-info" v-if="gameStore.parsedCapturedTarget">
            <p>D: {{ gameStore.parsedCapturedTarget.distance.toFixed(0) }}</p>
            <p>V: {{ gameStore.parsedCapturedTarget.speed.toFixed(0) }}</p>
            <p>H: {{ gameStore.parsedCapturedTarget.altitude.toFixed(0) }}</p>
        </div>
    </div>

</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDevice } from '../../../stores/device';
import { useGameStore } from '../../../stores/game';

const device = useDevice()
const gameStore = useGameStore()

const cameraFov = 75;
const viewAngle = computed(() => 0.06 /*gameStore.currentAA?.captureAngle || 0 */)
const azimuth = computed(() => gameStore.direction.azimuth * (180 / Math.PI))
const elevation = computed(() => gameStore.direction.elevation * (180 / Math.PI))
const isCaptured = computed(() => !!gameStore.currentAA?.capturedTargetId)

// Расчет размера рамки прицела
const aimTargetStyle = computed(() => {
    const viewAngleDeg = viewAngle.value * (180 / Math.PI); // Преобразуем viewAngle в градусы
    const sizePercentage = (viewAngleDeg / cameraFov) * 100 * (gameStore.viewMode === 'capture' ? 8 : 1); // Размер рамки относительно FOV
    if (device.orientation === 'portrait') return {
        height: `${sizePercentage}%`,
    }
    return {
        width: `${sizePercentage}%`,
    };
});
</script>

<style scoped>
.gui {
    @apply fixed top-0 left-0 right-0 bottom-0 font-bold text-green-600;
    font-size: 14px;
}

.gui__missiles {
    @apply absolute top-[16px] left-1/2 transform -translate-x-1/2 flex gap-2 text-center;
}

.gui__missile-count {
    width: 50px;
}

.gui__missile-count.almost-empty {
    @apply animate-pulse text-red-600;
    animation-duration: 0.3s;
}

.gui__missile-status {
    width: 50px;
}

.gui__missile-status.not-ready {
    @apply animate-pulse text-red-600;
    animation-duration: 0.3s;
}

.gui__azimuth {
    @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[90px] text-lg font-bold;
}

.gui__elevation {
    @apply absolute top-1/2 left-1/2 transform -translate-x-[90px] -translate-y-1/2 text-lg font-bold;
}

.gui__capture-rect {
    @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse;
    width: 70px;
    height: 70px;
    transform-origin: center;
    animation-duration: 0.3s;
}

.gui__search-rect {
    @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2;
    transform-origin: center;
}

.gui__target-info {
    @apply absolute top-1/2 left-1/2 transform -translate-y-1/2 translate-x-[90px] font-bold w-[70px];
}
</style>