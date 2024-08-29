<template>
    <TresAxesHelper />
    <TresMesh ref="terrainMesh" name="heightMap">
        <TresPlaneGeometry :args="planeGeometryArgs" />
        <TresMeshStandardMaterial color="green" />
    </TresMesh>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMissionStore } from '../../../stores/mission';
import * as THREE from 'three';
import { computed, ref, watch } from 'vue';
import _ from 'lodash'

const missionStore = useMissionStore();
const { map } = storeToRefs(missionStore);

const terrainMesh = ref<THREE.Mesh | null>(null);

const planeGeometryArgs = computed(() => [
  map.value.size * map.value.data.length,
  map.value.size * _.get(map.value.data, '[0].length', 0),
  map.value.data.length - 1,
  _.get(map.value.data, '[0].length', 0) - 1
]);

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


watch(map, () => createHeightmap(), { deep: true })
</script>