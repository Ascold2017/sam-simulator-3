<template>
    <div class="start-screen">

        <h1 class="start-screen__title">Start Screen</h1>

        <button class="start-screen__button" @click="startMission">Start Game</button>

    </div>
</template>

<script setup lang="ts">
import { useMissionStore } from '../../stores/mission';

const { startMission } = useMissionStore();

</script>

<style scoped>
.start-screen {

    @apply flex flex-col items-center justify-center h-screen;
}


.start-screen__title {

    @apply text-4xl mb-8;
}


.start-screen__button {

    @apply px-4 py-2 bg-blue-500 text-white rounded;

}
</style>