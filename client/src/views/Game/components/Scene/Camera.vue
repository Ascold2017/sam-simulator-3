<template>
    <TresPerspectiveCamera v-if="currentAA" :fov="75" :far="10000" :zoom="zoom"
        :position="[currentAA.position.x, currentAA.position.y, currentAA.position.z]"
        :look-at="[currentAA.position.x + 1, currentAA.position.y, currentAA.position.z]"
        :key="zoom + currentAA.position.x + currentAA.position.y + currentAA.position.z" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useGameStore } from '../../../../stores/game';
import { computed, ref, watch } from 'vue';
import { useTres, useLoop } from '@tresjs/core';

const gameStore = useGameStore()
const { currentAA, direction, viewMode } = storeToRefs(gameStore);

const { camera } = useTres();
const { render } = useLoop()

const zoom = computed(() => {
    if (viewMode.value === 'capture') return 3
    return 1
})

function updateCameraRotation() {
    camera.value?.rotation.set(direction.value.elevation, direction.value.azimuth, 0, 'YXZ');
}
render(({ renderer, scene, camera }) => {
    updateCameraRotation();
    renderer.render(scene, camera)

})


</script>