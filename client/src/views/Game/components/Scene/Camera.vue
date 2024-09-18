<template>
    <TresPerspectiveCamera v-if="currentAA" :fov="75" :far="10000" :zoom="zoom"
        :position="[currentAA.position.x, currentAA.position.y, currentAA.position.z]"
        :key="zoom + currentAA.position.x + currentAA.position.y + currentAA.position.z" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useGameStore } from '../../../../stores/game';
import { computed } from 'vue';
import { useLoop } from '@tresjs/core';

const gameStore = useGameStore()
const { currentAA, direction, viewMode } = storeToRefs(gameStore);

const { render, } = useLoop()

const zoom = computed(() => {
    if (viewMode.value === 'capture') return 3
    return 1
});


render(({ renderer, scene, camera }) => {
    camera.rotation.set(direction.value.elevation, direction.value.azimuth, 0, 'YXZ');
    renderer.render(scene, camera);
});

</script>