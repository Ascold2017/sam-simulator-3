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
        <div class="gui__search-rect" v-else :style="searchRectStyle">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect x="0" y="0" width="24" height="24" stroke="rgb(21, 128, 61)" fill="none" stroke-width="1"
                    stroke-dasharray="12" stroke-dashoffset="6" />
            </svg>
        </div>
        <!-- Captured target info -->
        <div class="gui__target-info" v-if="gameStore.parsedCapturedTarget">
            <p>D: {{ gameStore.parsedCapturedTarget.distance.toFixed(0) }}</p>
            <p>V: {{ gameStore.parsedCapturedTarget.speed.toFixed(0) }}</p>
            <p>Vr: {{ gameStore.parsedCapturedTarget.radialSpeed.toFixed(0) }}</p>
            <p>H: {{ gameStore.parsedCapturedTarget.altitude.toFixed(0) }}</p>

            <!-- Стрелка направления цели -->
            <div class="gui__target-direction">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" class="direction-arrow"
                    :style="{ transform: 'rotate(' + (-gameStore.parsedCapturedTarget.targetDirection + 90) + 'deg)' }">
                    <!-- Линия стрелки -->
                    <line x1="10" y1="50" x2="90" y2="50" stroke="rgb(21, 128, 61)" stroke-width="2" />
                    <!-- Кольцо на начале стрелки -->
                    <circle cx="10" cy="50" r="5" fill="rgb(21, 128, 61)" stroke-width="2" />
                    <!-- Маленькая стрелка на конце -->
                    <polygon points="90,45 100,50 90,55" fill="rgb(21, 128, 61)" />
                </svg>
            </div>
        </div>



        <!-- Detected targets (frames) -->
        <div v-for="target in detectedTargetsOnScreen" :key="target.id" class="gui__target-frame"
            :style="{ left: target.screenPosition.x + 'px', top: target.screenPosition.y + 'px' }">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <rect x="0" y="0" width="24" height="24" stroke="rgb(0, 255, 0)" fill="none" stroke-width="1"
                    stroke-dasharray="12" stroke-dashoffset="6" />
            </svg>
        </div>

    </div>

</template>

<script setup lang="ts">
import { computed } from 'vue';
import { CAMERA_SETTINGS, useGameStore } from '../../../stores/game';
import { Vector3 } from 'three';

const gameStore = useGameStore()

const viewAngle = computed(() => gameStore.currentAA?.captureAngle || 0)
const azimuth = computed(() => gameStore.direction.azimuth * (180 / Math.PI))
const elevation = computed(() => gameStore.direction.elevation * (180 / Math.PI))
const isCaptured = computed(() => !!gameStore.currentAA?.capturedTargetId)

// Расчет размера рамки прицела
const searchRectStyle = computed(() => {
    const viewAngleDeg = viewAngle.value * (180 / Math.PI); // Преобразуем viewAngle в градусы
    const sizePercentage = (viewAngleDeg / CAMERA_SETTINGS.fov) * 100; // Размер рамки относительно FOV
    return {
        height: `${sizePercentage}%`,
    }
});

const detectedTargetsOnScreen = computed(() => {
    if (!gameStore.currentAA || !gameStore.cameraLink) return [];

    const camera = gameStore.cameraLink;
    const targets = gameStore.parsedTargetNPCs;

    return targets
        .filter(target => !target.isDestroyed)
        .map(target => {
            // Преобразуем мировые координаты в экранные
            const worldPosition = new Vector3(...target.position);
            const screenPosition = worldPosition.project(camera);

            return {
                id: target.id,
                screenPosition: {
                    x: ((screenPosition.x + 1) / 2) * window.innerWidth,
                    y: ((1 - screenPosition.y) / 2) * window.innerHeight,
                },
            };
        })
        .filter(target => target.screenPosition.x >= 0 && target.screenPosition.x <= window.innerWidth
            && target.screenPosition.y >= 0 && target.screenPosition.y <= window.innerHeight);
});
</script>

<style scoped>
.gui {
    @apply fixed top-0 left-0 right-0 bottom-0 font-bold text-green-600;
    font-size: 14px;
    z-index: 1;
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
    @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 aspect-square;
    transform-origin: center;
}

.gui__target-info {
    @apply absolute top-1/2 left-1/2 transform -translate-y-1/2 translate-x-[90px] font-bold w-[70px];
}

.gui__target-frame {
    @apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px];
}

.gui__target-direction {
    @apply absolute top-1/2 -left-[60px] transform -translate-x-1/2 translate-y-[90px];
    margin: 10px auto;
}

.direction-arrow {
    width: 50px;
    height: 50px;
    transform-origin: 50% 0;
}
</style>