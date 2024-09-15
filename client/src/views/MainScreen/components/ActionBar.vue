<template>
    <div class="action-bar" :class="{ 'action-bar_landscape': orientation === 'landscape' }" v-if="isMobile">
        <div class="action-bar__actions">
            <button v-if="isMobile" class="action-button action-button_capture"
                @click="gameStore.captureTarget">CAPTURE</button>


            <button v-if="isMobile" class="action-button action-button_fire" @click="gameStore.fireTarget">FIRE</button>
        </div>
        <Map />

    </div>
    <Map v-else class="fixed-map"></Map>
</template>

<script setup lang="ts">
import Map from './Map.vue';
import { useDevice } from '../../../stores/device';
import { storeToRefs } from 'pinia';
import { useGameStore } from '../../../stores/game';

const gameStore = useGameStore()
const device = useDevice()
const { isMobile, orientation } = storeToRefs(device)
</script>

<style scoped>
.action-bar {
    @apply flex flex-col items-center p-4 justify-between bg-gray-700 flex-1;
}
.action-bar_landscape {
    @apply flex-col-reverse;
}

.action-bar__actions {
    @apply flex justify-between w-full;
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

.fixed-map {
    @apply fixed bottom-2 left-2 w-[300px] h-[300px];
}
</style>