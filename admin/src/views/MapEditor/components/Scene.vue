<template>
    <section class="scene">
        <Suspense v-if="terrainPath">
            <LoadIndicator />
        </Suspense>
        <TresCanvas alpha clearColor="#3b82f6">
            <TresAmbientLight :color="0x404040" :intensity="0.8" />
            <TresDirectionalLight :color="0xffffff" :intensity="1.2" :position="[100, 100, 100]" :look-at="[0, 0, 0]" />
            <TresPerspectiveCamera :far="25000" :position="[0, 100, 0]" />
            <OrbitControls :enableRotate="!isDisabledOrbitControls" :maxDistance="10000" :minDistance="500" />

            <TransformControls v-if="selectedObject" :object="selectedObject" mode="translate" axis="Y"
                @object-change="handleObjectChange" @click="cancelEditing" />

            <Sphere v-for="s in boundingSpheres" :position="s.position" :args="[s.radius]" :userData="s.userData"
                color="red" @click="editPosition($event.object)" />

            <Suspense v-if="terrainPath">
                <GLTFModel :path="terrainPath" />
            </Suspense>
        </TresCanvas>
    </section>
</template>
<script setup lang="ts">
import LoadIndicator from '../../../components/LoadIndicator.vue';
import { TresCanvas } from '@tresjs/core';
import { OrbitControls, TransformControls, GLTFModel, Sphere } from '@tresjs/cientos'
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { Object3D } from 'three';
import { useMaps } from '../../../stores/maps';
const mapStore = useMaps();

const { mapFilename, mapData, mapSize } = storeToRefs(mapStore);

const isDisabledOrbitControls = ref(false)
const selectedObject = ref<Object3D | null>(null);
const terrainPath = computed(() => mapFilename.value ? `${import.meta.env.VITE_APP_STATIC_URL}/models/${mapFilename.value}/scene.gltf` : '');

const boundingSpheres = computed(() => {
    const spheres = []
    for (let i = 0; i < mapData.value.length; i++) {
        for (let j = 0; j < mapData.value[i].length; j++) {
            const coordX = mapSize.value / 2 - i * (mapSize.value / 10)
            const coordY = mapSize.value / 2 - j * (mapSize.value / 10)
            spheres.push({
                position: [coordX, mapData.value[i][j], coordY],
                userData: { i, j },
                radius: 50
            })
        }
    }
    return spheres
})

const handleObjectChange = () => {
    const obj = selectedObject.value
    if (!obj) return
    const userData = obj.userData;

    const updatedData = mapData.value;
    updatedData[userData.i][userData.j] = obj.position.y
    mapData.value = updatedData;

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