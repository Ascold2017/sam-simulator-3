<template>
    <primitive :object="model.scene" />
</template>
<script setup lang="ts">
import { useGLTF } from '@tresjs/cientos'
import { useRenderLoop } from '@tresjs/core';
import { Vector3 } from 'three';

const props = defineProps<{ direction: [number, number, number] }>();
const modelPath = `${import.meta.env.VITE_APP_STATIC_URL}/aa/AA.gltf`;
const model = await useGLTF(modelPath)

const { onLoop } = useRenderLoop();

onLoop(() => {
    const radar = model.scene.getObjectByName('Radar');
    const tower = model.scene.getObjectByName('Tower');
    radar.rotateY(0.05);

    // Применение направления к башне
    if (tower && props.direction) {
        const directionVector = new Vector3(...props.direction);
        const azimuth = Math.atan2(directionVector.x, directionVector.z);
        const elevation = Math.asin(directionVector.y); 

        tower.rotation.set(0, azimuth - Math.PI / 2, elevation);
    }
})
</script>