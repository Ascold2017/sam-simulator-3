<template>
    <section class="scene">
        <Suspense v-if="terrainPath">
            <LoadIndicator />
        </Suspense>
        <TresCanvas alpha clearColor="#3b82f6">
            <TresAmbientLight :color="0x404040" :intensity="0.8" />
            <TresDirectionalLight :color="0xffffff" :intensity="1.2" :position="[100, 100, 100]" :look-at="[0, 0, 0]" />
            <TresPerspectiveCamera :far="20000" :position="[0, 100, 0]" />
            <OrbitControls :enableRotate="!isDisabledOrbitControls" :maxDistance="5000" :minDistance="500" />

            <TransformControls v-if="selectedObject" :object="selectedObject" mode="translate"
                @object-change="handleObjectChange" @click="cancelEditing" />

            <Suspense v-if="terrainPath">
                <GLTFModel :path="terrainPath" />
            </Suspense>
        </TresCanvas>
    </section>
</template>
<script setup lang="ts">
import LoadIndicator from '../../../components/LoadIndicator.vue';
import { TresCanvas } from '@tresjs/core';
import { OrbitControls, TransformControls, GLTFModel } from '@tresjs/cientos'
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { Object3D } from 'three';
import { useMaps } from '../../../stores/maps';
const mapStore = useMaps();

const { mapFilename } = storeToRefs(mapStore);

const isDisabledOrbitControls = ref(false)
const selectedObject = ref<Object3D | null>(null);
const terrainPath = computed(() => mapFilename.value ? `${import.meta.env.VITE_APP_STATIC_URL}/models/${mapFilename.value}/scene.gltf` : '');



const handleObjectChange = () => {
    const obj = selectedObject.value
    if (!obj) return
    const userData = obj.userData;
    
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