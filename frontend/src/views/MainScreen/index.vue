<template>
    <div class="main-screen">
        <div class="main-screen__canvas-container">
            <h1>Main screen</h1>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useMissionStore } from '../../stores/mission';
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