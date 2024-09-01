<template>
    <div class="main-screen__header">
        <h1 class="text-xl">Mission Control</h1>
        <div >
        <span>Azimuth: {{ azimuth.toFixed(0)  }}</span>
        <span>Elevation: {{ elevation.toFixed(0)  }}</span>
    </div>
        <button class="btn-stop-mission" @click="missionStore.stopMission">
            Stop Mission
        </button>
    </div>
    
    <div class="main-screen" style="height: 100%;">

    </div>

</template>

<script setup lang="ts">
import { onUnmounted } from 'vue';
import { useSceneStore } from '../../stores/scene/scene';
import { onMounted } from 'vue';
import { useMissionStore } from '../../stores/mission';
import { useCameraStore } from '../../stores/camera';
import { computed } from 'vue';

const missionStore = useMissionStore()
const scene = useSceneStore()
const cameraStore = useCameraStore()

const azimuth = computed(() => cameraStore.azimuth * (180 / Math.PI))
const elevation = computed(() => cameraStore.elevation * (180 / Math.PI))

onMounted(() => {
    scene.initializeScene('.main-screen')
})

onUnmounted(() => {
    scene.$reset();
})
</script>

<style>
.main-screen__header {
    @apply fixed top-0 left-0 w-full bg-gray-800 text-white p-4 flex justify-between items-center;
}

.btn-stop-mission {
    @apply bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded;
}
</style>