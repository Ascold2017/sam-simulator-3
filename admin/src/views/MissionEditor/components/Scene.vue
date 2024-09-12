<template>
    <section class="scene">
        <Suspense v-if="terrainPath">
            <LoadIndicator />
        </Suspense>
        <TresCanvas alpha>
            <TresGridHelper :args="[1000, 1000]" />
            <TresAxesHelper :args="[100]" />
            <TresAmbientLight :color="0x404040" :intensity="0.8" />
            <TresDirectionalLight :color="0xffffff" :intensity="1.2" :position="[100, 100, 100]" :look-at="[0, 0, 0]" />
            <TresPerspectiveCamera :far="20000" :position="[0, 100, 0]" />
            <OrbitControls />

            <Cone :args="[10, 20]" v-for="aaPosition in aaPositions" :key="aaPosition.id"
                :position="[aaPosition.position.x, aaPosition.position.y, aaPosition.position.z]">
                <TresMeshStandardMaterial color="red" />
            </Cone>

            <Suspense v-if="terrainPath">
                <GLTFModel :path="terrainPath" />
            </Suspense>
        </TresCanvas>
    </section>
</template>
<script setup lang="ts">
import LoadIndicator from './LoadIndicator.vue';
import { TresCanvas } from '@tresjs/core';
import { Box, Cone, OrbitControls, GLTFModel } from '@tresjs/cientos'
import { useMissionEditor } from '../../../stores/missionEditor';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';
const missionEditor = useMissionEditor();

const { currentMap, aaPositions } = storeToRefs(missionEditor);

const terrainPath = computed(() => currentMap.value ? `${import.meta.env.VITE_APP_STATIC_URL}/models/${currentMap.value.filename}/scene.gltf` : '')
</script>

<style scoped>
.scene {
    @apply relative;
}
</style>