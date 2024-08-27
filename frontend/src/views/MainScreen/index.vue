<template>
    <div class="main-screen">
        <div class="main-screen__canvas-container">
            <Display :radars="missionStore.radars" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMissionStore } from '../../stores/mission';
import Display from './components/Display.vue'
const missionStore = useMissionStore();
</script>

<style scoped>
.main-screen {
    @apply flex flex-col items-center justify-center h-screen;
}

.main-screen__canvas-container {
    @apply w-full max-w-[1000px] aspect-square bg-black;
}
</style>