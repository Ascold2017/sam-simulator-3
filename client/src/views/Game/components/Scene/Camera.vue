<template>
    <TresPerspectiveCamera v-if="currentAA" :fov="CAMERA_SETTINGS.fov" :far="CAMERA_SETTINGS.far" :aspect="CAMERA_SETTINGS.aspect" :zoom="zoom"
        :position="currentAA.position"
        :key="zoom + currentAA.position.join(',') + direction.azimuth + direction.elevation" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useGameStore, CAMERA_SETTINGS } from '../../../../stores/game';
import { computed, onMounted } from 'vue';
import { useLoop } from '@tresjs/core';
import { Vector3 } from 'three';

const gameStore = useGameStore()
const { currentAA, direction, viewMode, parsedTargetNPCs } = storeToRefs(gameStore);

const currentTarget = computed(() => {
    return parsedTargetNPCs.value.find(t => t.id === currentAA.value?.capturedTargetId)
})
const { render } = useLoop()

const zoom = computed(() => {
    if (viewMode.value === 'capture') return CAMERA_SETTINGS.captureZoom
    return CAMERA_SETTINGS.defaultZoom
});


onMounted(() => {
    render(({ renderer, scene, camera }) => {
        if (currentTarget.value) {
            camera.lookAt(new Vector3(...currentTarget.value.position));
        } else {
            camera.rotation.set(direction.value.elevation, direction.value.azimuth, 0, 'YXZ');
        }
        gameStore.cameraLink = camera;
        
        renderer.render(scene, camera);
    });
})

</script>