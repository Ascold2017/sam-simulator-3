<template>
    <div class="action-bar">
        <Radar class="action-bar__radar" ref="radarRef" />
        <button class="action-bar__radar-scale" @click="radarRef?.toggleScale">SCALE</button>

        <div class="action-bar__guidance-methods" :class="{ 'action-bar__guidance-methods--mobile': isMobile }">
            <button class="action-bar__guidance-method"
                :class="{ 'action-bar__guidance-method--active': gameStore.guidanceMethod === '3p' }"
                @click="gameStore.guidanceMethod = '3p'">3P</button>
            <button class="action-bar__guidance-method"
                :class="{ 'action-bar__guidance-method--active': gameStore.guidanceMethod === '1/2' }"
                @click="gameStore.guidanceMethod = '1/2'">1/2</button>

        </div>
        <template v-if="isMobile">
            <button class="action-bar__fire" @click="gameStore.fireTarget">FIRE</button>

            <button class="action-bar__capture" @click="toggleCapture">
                {{ gameStore.viewMode === 'search' ? 'CAPTURE' : 'SEARCH' }}
            </button>
        </template>
        <div class="action-bar__hints" v-else>
            <button class="action-bar__hints-hint">
                <span>
                    < X>
                </span>
                <span>SEARCH</span>
            </button>
            <button class="action-bar__hints-hint">
                <span>
                    < C>
                </span>
                <span>CAPTURE</span>
            </button>
            <button class="action-bar__hints-hint">
                <span>
                    < Space>
                </span>
                <span>Fire</span>
            </button>
        </div>
        <Joystick :min-elevation="0" :max-elevation="0.872" :look-speed="lookSpeed" :direction="direction"
            @change="direction = $event" class="action-bar__joystick" />
    </div>
</template>

<script setup lang="ts">
import Radar from './Radar/index.vue';
import Joystick from './Joystick.vue';
import { useDevice } from '../../../stores/device';
import { storeToRefs } from 'pinia';
import { useGameStore } from '../../../stores/game';
import { computed, ref } from 'vue';

const gameStore = useGameStore()
const { direction, viewMode } = storeToRefs(gameStore)
const device = useDevice()
const { isMobile } = storeToRefs(device)

const lookSpeed = computed(() => {
    if (viewMode.value === 'capture') return 0.2
    return 1
})

const radarRef = ref<InstanceType<typeof Radar> | null>(null)


const toggleCapture = () => {
    if (viewMode.value === 'search') {
        gameStore.captureTarget()
    } else {
        gameStore.resetTarget()
    }
}
</script>

<style scoped>
.action-bar {
    @apply fixed bottom-0 left-0 right-0 flex py-2 px-4 items-end;
    z-index: 2;
}


.action-bar__radar {
    @apply fixed bottom-4 left-4;
}

.action-bar__joystick {
    @apply fixed bottom-[40px] right-[80px];
}

.action-bar__radar-scale {
    @apply fixed bottom-[250px] left-4 rounded bg-green-600 text-white w-[70px] h-[70px];
    border-radius: 50%;
}

.action-bar__fire {
    @apply fixed bottom-4 left-[250px] rounded bg-red-600 text-white w-[90px] h-[90px];
    border-radius: 50%;
}

.action-bar__capture {
    @apply fixed bottom-[150px] right-[20px] rounded bg-green-600 text-white w-[70px] h-[70px];
    border-radius: 50%;
}

.action-bar__actions {
    @apply flex flex-col gap-1 fixed right-0 bottom-[100px];
}

.action-button {
    @apply bg-green-700 text-white w-[70px] h-[60px] font-bold;
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
    @apply text-lg text-gray-600;
}

.action-bar__hints-hint span:nth-child(2) {
    @apply rounded bg-gray-600 px-1 text-xl flex flex-col items-center justify-center w-[80px];
    aspect-ratio: 1;
}

.action-bar__guidance-methods {
    @apply flex gap-2 fixed bottom-4 left-[270px];
}
.action-bar__guidance-methods.action-bar__guidance-methods--mobile {
    @apply right-[50%] translate-x-[50%] left-auto;
}

.action-bar__guidance-method {
    @apply rounded bg-blue-600 text-white w-[60px] h-[60px];
    border-radius: 50%;
}

.action-bar__guidance-method--active {
    @apply text-red-600;
}

</style>