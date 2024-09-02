<template>
    <div class="aim-target" :class="{ 'aim-target_landscape': device.orientation === 'landscape' }"
        @click="aaStore.captureTarget">
        <span class="aim-target__elevation">{{ elevation.toFixed(0) }}*</span>
        <span class="material-icons">fullscreen</span>
        <span class="aim-target__azimuth">{{ azimuth.toFixed(0) }}*</span>
    </div>

</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCameraStore } from '../../../stores/camera';
import { useDevice } from '../../../stores/device';
import { useAAStore } from '../../../stores/aa';

const cameraStore = useCameraStore()
const device = useDevice()


const aaStore = useAAStore()
const azimuth = computed(() => cameraStore.azimuth * (180 / Math.PI))
const elevation = computed(() => cameraStore.elevation * (180 / Math.PI))

</script>

<style scoped>
.aim-target {
    @apply fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer;
}

.aim-target .material-icons {
    @apply text-white;
    font-size: 100px;
}

.aim-target_landscape .material-icons {
    font-size: 200px;
}

.aim-target:hover .material-icons {
    font-size: 120px;
}

.aim-target__azimuth {
    @apply text-white absolute left-1/2 transform -translate-x-1/2;
    bottom: -10px;
}

.aim-target__elevation {
    @apply text-white absolute top-1/2 transform -translate-y-1/2;
    right: -10px;

}
</style>