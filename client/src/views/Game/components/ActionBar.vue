<template>
    <div class="action-bar">
        <Radar class="action-bar__radar" />
        <template v-if="isMobile">
            <Joystick :min-elevation="0" :max-elevation="Math.PI / 4" :look-speed="1" :direction="direction"
                @change="direction = $event" class="action-bar__joystick" />

            <button class="action-bar__fire" @click="gameStore.fireTarget">FIRE</button>

            <div class="action-bar__actions">

                <button class="action-button action-button_search"
                    :class="{ 'action-button_active': gameStore.viewMode === 'search' }"
                    @click="gameStore.viewMode = 'search'">SEARCH</button>
                <button class="action-button action-button_capture"
                    :class="{ 'action-button_active': gameStore.viewMode === 'capture' }"
                    @click="gameStore.viewMode = 'capture'">CAPTURE</button>

            </div>
        </template>
        <div class="action-bar__hints" v-else>
            <button class="action-bar__hints-hint">
                <span>
                    < X >
                </span>
                <span>SEARCH</span>
            </button>
            <button class="action-bar__hints-hint">
                <span>
                    < C >
                </span>
                <span>CAPTURE</span>
            </button>
            <button class="action-bar__hints-hint">
                <span>
                    < Space >
                </span>
                <span>Fire</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import Radar from './Radar/index.vue';
import Joystick from './Joystick.vue';
import { useDevice } from '../../../stores/device';
import { storeToRefs } from 'pinia';
import { useGameStore } from '../../../stores/game';

const gameStore = useGameStore()
const { direction } = storeToRefs(gameStore)
const device = useDevice()
const { isMobile } = storeToRefs(device)
</script>

<style scoped>
.action-bar {
    @apply fixed bottom-0 left-0 right-0 flex py-2 px-4 items-end;
}


.action-bar__radar {
    @apply fixed bottom-4 left-4;
}

.action-bar__joystick {
    @apply fixed bottom-4 right-4;
}

.action-bar__fire {
    @apply fixed bottom-4 left-[240px] rounded bg-red-500 text-white w-[90px] h-[90px];
    border-radius: 50%;
}

.action-bar__actions {
    @apply flex flex-col gap-1 fixed right-0 top-[50%] translate-y-[-50%];
}

.action-button {
    @apply bg-green-700 text-white w-[60px] h-[60px];
}

.action-button_active {
    @apply text-red-600;
}


.action-bar__hints {
    @apply flex gap-2 fixed bottom-2 left-[50%] translate-x-[-50%];
}

.action-bar__hints-hint {
    @apply flex flex-col items-center text-white;
}

.action-bar__hints-hint span:nth-child(1) {
    @apply text-lg text-gray-500;
}

.action-bar__hints-hint span:nth-child(2) {
    @apply rounded bg-gray-500 px-1 text-xl flex flex-col items-center justify-center w-[80px];
    aspect-ratio: 1;
}
</style>