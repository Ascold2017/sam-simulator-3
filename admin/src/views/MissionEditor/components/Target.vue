<template>
    <TresGroup>
        <Line2 v-if="waypoints.length > 0"
            :points="waypoints.map((waypoint) => [waypoint.position.x, waypoint.position.y, waypoint.position.z])"
            :line-width="2" color="white" />
        <Sphere v-for="(waypoint, index) in waypoints" :args="[30, 10, 10]"
            :position="[waypoint.position.x, waypoint.position.y, waypoint.position.z]"
            :color="getSphereColor(index, target.waypoints.length)"
            :user-data="{ isWaypoint: true, waypoint: waypoint, waypointIndex: index, target: target }"
            @click="emit('click', $event.object)" @double-click="emit('editWaypoint', waypoint, index)" />
    </TresGroup>


</template>

<script setup lang="ts">
import { Object3D } from 'three';
import { Line2, Sphere } from '@tresjs/cientos'
import { EditableTarget } from '../../../stores/missionEditor';
import { computed } from 'vue';


const props = defineProps<{ target: EditableTarget }>()

const emit = defineEmits<{ click: [object: Object3D], editWaypoint: [waypoint: any, index: number] }>()

const waypoints = computed(() => props.target.waypoints)

const getSphereColor = (index: number, totalWaypoints: number) => {
    if (index === 0) return 'blue'; // Первый шар - синий
    if (index === totalWaypoints - 1) return 'red'; // Последний шар - красный
    return 'yellow'; // Остальные шары - желтые
}
</script>