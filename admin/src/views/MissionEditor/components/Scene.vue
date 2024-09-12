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
            <OrbitControls :enableRotate="!isDisabledOrbitControls" />

            <TransformControls v-if="selectedObject" :object="selectedObject" mode="translate"
                @object-change="handleObjectChange" @click="cancelEditing" />

            <Cone :args="[10, 20]" v-for="aaPosition in aaPositions" :key="aaPosition.id"
                :position="[aaPosition.position.x, aaPosition.position.y, aaPosition.position.z]">
                <TresMeshStandardMaterial color="red" />
            </Cone>

            <TresGroup v-for="target in targets" :key="target.id">
                <Line2
                    :points="target.waypoints.map((waypoint) => [waypoint.position.x, waypoint.position.y, waypoint.position.z])"
                    :line-width="2" color="white" />
                <Sphere v-for="(waypoint, index) in target.waypoints"
                    :position="[waypoint.position.x, waypoint.position.y, waypoint.position.z]"
                    :color="getSphereColor(index, target.waypoints.length)" :size="1000"
                    :user-data="{ isWaypoint: true, waypoint: waypoint, waypointIndex: index, target: target }"
                    @click="editPosition($event.object)" />
            </TresGroup>

            <Suspense v-if="terrainPath">
                <GLTFModel :path="terrainPath" />
            </Suspense>
        </TresCanvas>
    </section>
</template>
<script setup lang="ts">
import LoadIndicator from './LoadIndicator.vue';
import { TresCanvas } from '@tresjs/core';
import { Line2, Sphere, Cone, OrbitControls, TransformControls, GLTFModel } from '@tresjs/cientos'
import { useMissionEditor } from '../../../stores/missionEditor';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
import { Object3D } from 'three';
const missionEditor = useMissionEditor();

const { currentMap, aaPositions, targets } = storeToRefs(missionEditor);

const isDisabledOrbitControls = ref(false)
const selectedObject = ref<Object3D | null>(null);
const terrainPath = computed(() => currentMap.value ? `${import.meta.env.VITE_APP_STATIC_URL}/models/${currentMap.value.filename}/scene.gltf` : '');

const getSphereColor = (index: number, totalWaypoints: number) => {
    if (index === 0) return 'blue'; // Первый шар - синий
    if (index === totalWaypoints - 1) return 'red'; // Последний шар - красный
    return 'yellow'; // Остальные шары - желтые
}

const handleObjectChange = () => {
    if (selectedObject.value && selectedObject.value.userData.isWaypoint) {
        console.log(selectedObject.value.userData.target.id, selectedObject.value.position)
        targets.value = targets.value.map((target) => {
            if (target.id === selectedObject.value!.userData.target.id) {
                target.waypoints = target.waypoints.map((waypoint, index) => {
                    if (index === selectedObject.value!.userData.waypointIndex) {
                        return {
                            ...waypoint,
                            position: {
                                x: selectedObject.value!.position.x,
                                y: selectedObject.value!.position.y,
                                z: selectedObject.value!.position.z
                            }
                        }
                    }
                    return waypoint
                })
            }
            return target
        })
    }
}

const editPosition = (object: Object3D) => {
    isDisabledOrbitControls.value = true;
    selectedObject.value = object;
}

const cancelEditing = () => {
    console.log('Cancel editing');
    isDisabledOrbitControls.value = false;
    selectedObject.value = null;
}
</script>

<style scoped>
.scene {
    @apply relative;
}
</style>