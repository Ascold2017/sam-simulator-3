<template>
    <div class="top-bar">
        <DownCounter v-if="roomStore.parsedCurrentRoom" :end-date="roomStore.parsedCurrentRoom.endedAt!"/>
        <button class="top-bar__button" @click="roomStore.leaveRoom">
            Exit
        </button>
    </div>
</template>

<script setup lang="ts">
import { useRooms } from '../../../stores/rooms';
import DownCounter from '../../../components/DownCounter.vue';

const roomStore = useRooms()
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