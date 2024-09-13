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

            <AAPosition v-for="aaPosition in aaPositions" :key="aaPosition.id" :aaPosition="aaPosition"
                @click="editPosition" />
            <Target v-for="target in targets" :key="target.id" :target="target" @click="editPosition"
                @editWaypoint="openEditPopup" />

            <Suspense v-if="terrainPath">
                <GLTFModel :path="terrainPath" />
            </Suspense>
        </TresCanvas>

        <teleport to="body">
            <!-- Попап для редактирования waypoints -->
            <Popup v-if="isPopupVisible" @close="closePopup">
                <template #header>Edit Waypoint #{{ currentWaypointIndex }}</template>
                <template #content>
                    <div class="flex flex-col items-end">
                    <BaseInput id="waypoint-x" v-model.number="currentWaypoint.position.x" label="X, m" class="mb-2" />
                    <BaseInput id="waypoint-y" v-model.number="currentWaypoint.position.y" label="Y (height), m"  class="mb-2"/>
                    <BaseInput id="waypoint-z" v-model.number="currentWaypoint.position.z" label="Z, m" class="mb-2" />
                    <BaseInput id="waypoint-speed" v-model.number="currentWaypoint.speed" label="Speed, m/s" />
                </div>
                </template>
            </Popup>

        </teleport>
    </section>
</template>
<script setup lang="ts">
import LoadIndicator from './LoadIndicator.vue';
import Target from './Target.vue'
import AAPosition from './AAPosition.vue'
import { TresCanvas } from '@tresjs/core';
import { OrbitControls, TransformControls, GLTFModel } from '@tresjs/cientos'
import { useMissionEditor } from '../../../stores/missionEditor/index';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { Object3D } from 'three';
import BaseInput from '../../../components/BaseInput.vue';
import Popup from '../../../components/Popup.vue';
const missionEditor = useMissionEditor();

const { currentMap, aaPositions, targets } = storeToRefs(missionEditor);

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

const isPopupVisible = ref(false);
const currentWaypoint = ref<any>(null);
const currentWaypointIndex = ref(0);

// Открытие попапа по правому клику
const openEditPopup = (waypoint: any, index: number) => {
    currentWaypoint.value = waypoint;  // Устанавливаем ссылку на реактивный объект waypoint
    currentWaypointIndex.value = index;
    isPopupVisible.value = true;
};

// Закрытие попапа
const closePopup = () => {
    isPopupVisible.value = false;
    currentWaypoint.value = null;
    currentWaypointIndex.value = 0;
};
</script>

<style scoped>
.scene {
    @apply relative;
}
</style>