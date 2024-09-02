<template>
    <div class="top-bar">

        <span>{{ device.orientation === 'landscape' ? 'SEARCH' : 'CAPTURE' }}</span>

        <button class="top-bar__button" @click="missionStore.stopMission">
            Exit
        </button>
    </div>
</template>

<script setup lang="ts">
import { useDevice } from '../../../stores/device';
import { useMissionStore } from '../../../stores/mission';


const missionStore = useMissionStore()
const device = useDevice()
</script>

<style lang="css" scoped>
.top-bar {
    @apply fixed top-0 left-0 w-full text-white p-4 flex justify-between items-center;
    z-index: 2;
}

.top-bar__button {
    @apply bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded;
}
</style>