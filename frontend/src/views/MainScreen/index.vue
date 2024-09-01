<template>
    <div class="main-screen__header">

        <span>{{ cameraStore.orientation }}</span>

        <button class="btn-stop-mission" @click="missionStore.stopMission">
            Exit
        </button>
    </div>

    <div class="main-screen" style="height: 100%;"></div>

    <div class="aim-target" @click="captureTarget">
        <span class="aim-target__elevation">{{ elevation.toFixed(0) }}*</span>
        <span class="material-icons">fullscreen</span>
        <span class="aim-target__azimuth">{{ azimuth.toFixed(0) }}*</span>
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

function captureTarget() {
    console.log(azimuth.value, elevation.value)
}
onMounted(() => {
    scene.initializeScene('.main-screen')
})

onUnmounted(() => {
    scene.$reset();
})
</script>

<style>
.main-screen__header {
    @apply fixed top-0 left-0 w-full text-white p-4 flex justify-between items-center;
}

.btn-stop-mission {
    @apply bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded;
}

.aim-target {
    @apply fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer;
}

.aim-target .material-icons {
    @apply text-white;
    font-size: 100px;
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