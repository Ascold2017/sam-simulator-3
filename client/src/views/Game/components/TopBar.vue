<template>
    <div class="top-bar">
        <button class="top-bar__button" @click="roomStore.leaveRoom">
            Exit
        </button>
        <DownCounter v-if="roomStore.parsedCurrentRoom" :end-date="roomStore.parsedCurrentRoom.endedAt!"/>
    </div>
</template>

<script setup lang="ts">
import { useRooms } from '../../../stores/rooms';
import DownCounter from '../../../components/DownCounter.vue';

const roomStore = useRooms()
</script>

<style lang="css" scoped>
.top-bar {
    @apply fixed top-0 left-0 w-full text-gray-400 p-4 flex justify-between items-start;
    z-index: 2;
}

.top-bar__button {
    @apply bg-transparent hover:bg-red-700 font-bold;
}
</style>