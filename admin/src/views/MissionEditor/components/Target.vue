<template>
    <TresGroup>
        <Line2 v-if="linePoints.length > 0" :points="linePoints" :line-width="2" color="white" :key="linePointsKey" />
        <Sphere v-for="(waypoint, index) in waypoints" :args="[30, 10, 10]"
            :position="[waypoint.position.x, waypoint.position.y, waypoint.position.z]"
            :color="getSphereColor(index, target.waypoints.length)"
            :user-data="{ isWaypoint: true, waypoint: waypoint, waypointIndex: index, target: target }"
            @click="emit('click', $event.object)" />
    </TresGroup>
</template>

<script setup lang="ts">
import { Object3D } from 'three';
import { Line2, Sphere } from '@tresjs/cientos'
import { EditableTarget } from '../../../stores/missionEditor/targets';
import { computed } from 'vue';


const props = defineProps<{ target: EditableTarget }>()

const emit = defineEmits<{ click: [object: Object3D] }>()


const waypoints = computed(() => props.target.waypoints);
const linePoints = computed<[number, number, number][]>(() => waypoints.value.map((waypoint) => [waypoint.position.x, waypoint.position.y, waypoint.position.z]));
const linePointsKey = computed(() => linePoints.value.map(p => p.join(',')).join('-'));

const getSphereColor = (index: number, totalWaypoints: number) => {
    if (index === 0) return 'blue'; // Первый шар - синий
    if (index === totalWaypoints - 1) return 'red'; // Последний шар - красный
    return 'yellow'; // Остальные шары - желтые
}
</script>