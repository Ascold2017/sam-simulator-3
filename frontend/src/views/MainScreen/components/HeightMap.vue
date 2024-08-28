<template>
    <TresMesh ref="terrainMesh">
        <TresPlaneGeometry :width="map.size * map.data.length" :height="map.size * map.data[0]?.length || 0" />
        <TresMeshStandardMaterial color="green" />
    </TresMesh>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMissionStore } from '../../../stores/mission';
import * as THREE from 'three';
import { ref, watch } from 'vue';

const missionStore = useMissionStore();
const { map } = storeToRefs(missionStore);

const terrainMesh = ref<THREE.Mesh | null>(null);

const createHeightmap = () => {
    if (!terrainMesh.value) return;

    const geometry = terrainMesh.value.geometry as THREE.PlaneGeometry;
    const position = geometry.attributes.position;

    for (let i = 0; i < position.count; i++) {
        const x = i % map.value.data.length;
        const y = Math.floor(i / map.value.data.length);
        const height = map.value.data[x]?.[y] || 0;
        position.setZ(i, height);
    }

    geometry.computeVertexNormals();
    position.needsUpdate = true;
};


watch(map, () => createHeightmap())
</script>