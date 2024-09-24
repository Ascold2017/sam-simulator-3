<template>
    <section class="scene">
        <Suspense v-if="terrainPath">
            <LoadIndicator />
        </Suspense>
        <TresCanvas alpha clearColor="#3b82f6">
            <TresGridHelper :args="[1000, 1000]" />
            <TresAxesHelper :args="[100]" />
            <TresAmbientLight :color="0x404040" :intensity="0.8" />
            <TresDirectionalLight :color="0xffffff" :intensity="1.2" :position="[100, 100, 100]" :look-at="[0, 0, 0]" />
            <TresPerspectiveCamera :far="20000" :position="[0, 100, 0]" />
            <OrbitControls :enableRotate="!isDisabledOrbitControls" :maxDistance="5000" :minDistance="500" />

            <TransformControls v-if="selectedObject" :object="selectedObject" mode="translate"
                @object-change="handleObjectChange" @click="cancelEditing" />

            <AAPosition v-for="aaPosition in aaPositionsToShow" :key="aaPosition.id" :aaPosition="aaPosition"
                @click="editPosition" />
            <Target v-for="target in targetsToShow" :key="target.id" :target="target" :is-highlighted="higlihtedTargetId === target.id" @click="editPosition" />

            <Suspense v-if="terrainPath">
                <GLTFModel :path="terrainPath" />
            </Suspense>
        </TresCanvas>
    </section>
</template>
<script setup lang="ts">
import LoadIndicator from '../../../components/LoadIndicator.vue';
import Target from './Target.vue'
import AAPosition from './AAPosition.vue'
import { TresCanvas } from '@tresjs/core';
import { OrbitControls, TransformControls, GLTFModel } from '@tresjs/cientos'
import { useMissionEditor } from '../../../stores/missionEditor/index';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { Object3D } from 'three';
const missionEditor = useMissionEditor();

const { currentMap, aaPositionsToShow, targetsToShow, higlihtedTargetId } = storeToRefs(missionEditor);

const isDisabledOrbitControls = ref(false)
const selectedObject = ref<Object3D | null>(null);
const terrainPath = computed(() => currentMap.value ? `${import.meta.env.VITE_APP_STATIC_URL}/models/${currentMap.value.filename}/scene.gltf` : '');



const handleObjectChange = () => {
    const obj = selectedObject.value
    if (!obj) return
    const userData = obj.userData;
    if (userData.isWaypoint) {
        missionEditor.updateWaypoint(userData.target.id, userData.waypointIndex, {
            ...userData.waypoint,
            position: {
                x: obj.position.x,
                y: obj.position.y,
                z: obj.position.z
            }
        })
    }

    if (userData.isAAPosition) {
        missionEditor.updateAAPosition({
            ...userData.aaPosition,
            position: selectedObject.value!.position
        })
    }
}

const editPosition = (object: Object3D) => {
    isDisabledOrbitControls.value = true;
    selectedObject.value = object;
}

const cancelEditing = () => {
    isDisabledOrbitControls.value = false;
    selectedObject.value = null;
}
</script>

<style scoped>
.scene {
    @apply relative;
}
</style>