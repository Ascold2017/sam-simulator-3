<template>
    <TresPerspectiveCamera v-if="currentAA" :fov="75" :far="10000" :zoom="zoom"
        :position="[currentAA.position.x, currentAA.position.y, currentAA.position.z]"
        :key="zoom + currentAA.position.x + currentAA.position.y + currentAA.position.z + direction.azimuth + direction.elevation" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useGameStore } from '../../../../stores/game';
import { computed, onMounted } from 'vue';
import { useLoop } from '@tresjs/core';

const gameStore = useGameStore()
const { currentAA, direction, viewMode } = storeToRefs(gameStore);

const { render } = useLoop()

const zoom = computed(() => {
    if (viewMode.value === 'capture') return 8
    return 1
});


onMounted(() => {
    render(({ renderer, scene, camera }) => {
        camera.rotation.set(direction.value.elevation, direction.value.azimuth, 0, 'YXZ');
        renderer.render(scene, camera);
    });
})

</script>