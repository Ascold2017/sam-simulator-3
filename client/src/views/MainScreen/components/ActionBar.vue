<template>
    <div class="action-bar">
        <button  v-if="isMobile && orientation !== 'portrait'" class="action-button action-button_capture" @click="gameStore.captureTarget">CAPTURE</button>

        <Map />
        <button v-if="isMobile && orientation !== 'landscape'" class="action-button action-button_fire" @click="gameStore.fireTarget">FIRE</button>
    </div>
</template>

<script setup lang="ts">
import Map from './Map.vue';
import { useDevice } from '../../../stores/device';
import { storeToRefs } from 'pinia';
import { useGameStore } from '../../../stores/game';

const gameStore = useGameStore()
const device = useDevice()
const { orientation, isMobile } = storeToRefs(device)
</script>

<style scoped>
.action-bar {
    @apply fixed bottom-0 left-0 right-0 flex py-2 px-4 justify-between;
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