<template>
    <div class="action-bar">
        <button class="action-button action-button_capture" @click="captureTarget">CAPTURE</button>

        <Map />
        <button class="action-button action-button_fire">FIRE</button>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCameraStore } from '../../../stores/camera';
import Map from './Map.vue';

const cameraStore = useCameraStore()

const azimuth = computed(() => cameraStore.azimuth * (180 / Math.PI))
const elevation = computed(() => cameraStore.elevation * (180 / Math.PI))

function captureTarget() {
    console.log(azimuth.value, elevation.value)
}
</script>

<style scoped>
.action-bar {
    @apply fixed bottom-0 left-0 right-0 flex py-2 px-4;
}

.action-button {
    @apply bg-white;
    border-radius: 50%;
    width: 90px;
    height: 90px;
}

.action-button_capture {
    margin-right: auto;
}

.action-button_fire {
    @apply bg-red-500 text-white;
}
</style>