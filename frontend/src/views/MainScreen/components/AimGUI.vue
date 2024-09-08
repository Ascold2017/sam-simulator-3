<template>
    <div class="aim-target" :class="{ 'aim-target_landscape': device.orientation === 'landscape' }"
        @click="gameStore.captureTarget" @contextmenu.prevent="gameStore.fireTarget">
        <span class="aim-target__elevation">{{ elevation.toFixed(0) }}*</span>
        <span class="material-icons">fullscreen</span>
        <span class="aim-target__azimuth">{{ azimuth.toFixed(0) }}*</span>
    </div>

</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDevice } from '../../../stores/device';
import { useGameStore } from '../../../stores/game';

const device = useDevice()
const gameStore = useGameStore()

const azimuth = computed(() => gameStore.direction.azimuth * (180 / Math.PI))
const elevation = computed(() => gameStore.direction.elevation * (180 / Math.PI))

</script>

<style scoped>
.aim-target {
    @apply fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer;
}

.aim-target .material-icons {
    @apply text-red-500;
    font-size: 100px;
}

.aim-target_landscape .material-icons {
    font-size: 200px;
}

.aim-target:hover .material-icons {
    font-size: 120px;
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