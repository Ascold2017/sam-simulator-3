<template>
    <section class="mission-editor-sidebar-targets">
        <div class="mission-editor-sidebar-targets__add-target mb-3">
            <h4 class="title text-white">Targets</h4>
            <BaseSelect id="target-object-select" class="ml-auto" v-model="newTargetObjectId" :options="targetsOptions"
                label="" />
            <button :disabled="!newTargetObjectId" @click="missionEditor.addTarget(newTargetObjectId)"
                class="button">Add</button>
        </div>


        <table class="data-table text-white mb-3">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Waypoints</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(target, index) in missionEditor.targetsToShow" :key="target.id">
                    <td>#{{ index }}</td>
                    <td>

                        <table class="data-table data-table--compact text-white">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>X</th>
                                    <th>Y</th>
                                    <th>Z</th>
                                    <th>Speed</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(waypoint, index) in target.waypoints" :key="index">
                                    <td>#{{ index }}</td>
                                    <td>{{ waypoint.position.x.toFixed(0) }}</td>
                                    <td>{{ waypoint.position.y.toFixed(0) }}</td>
                                    <td>{{ waypoint.position.z.toFixed(0) }}</td>
                                    <td>
                                        <BaseInput id="waypoint-speed" :model-value="waypoint.speed"
                                            @update:modelValue="missionEditor.updateWaypoint(target.id, index, { ...waypoint, speed: $event })"
                                            label="Speed, m/s" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td>
                        <button @click="missionEditor.removeTarget(target.id)"
                            class="button button--danger mb-2">Remove</button>
                        <button @click="missionEditor.addWaypoint(target.id)" class="button">Add
                            Waypoint</button>

                    </td>
                </tr>
            </tbody>
        </table>
    </section>
</template>


<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { ref, computed } from 'vue';
import { useMissionEditor } from '../../../../stores/missionEditor';
import { useTargets } from '../../../../stores/targets';
import BaseSelect from '../../../../components/BaseSelect.vue';
import BaseInput from '../../../../components/BaseInput.vue';


const targetsStore = useTargets()
const missionEditor = useMissionEditor()
const { targets } = storeToRefs(targetsStore)


const newTargetObjectId = ref<number | null>(null);

const targetsOptions = computed(() =>
    targets.value.map(target => ({ label: target.name, value: target.id })))
</script>

<style scoped>
.mission-editor-sidebar-targets {
    @apply w-full;
}

.mission-editor-sidebar-targets__add-target {
    @apply flex items-center gap-2 w-full;
}
</style>