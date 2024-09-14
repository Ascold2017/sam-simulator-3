<template>
    <section class="mission-editor-sidebar-aa-positions">
        <div class="mission-editor-sidebar-aa-positions__add mb-3">
            <h4 class="title text-white">AA Positions</h4>
            <button class="button ml-auto" @click="missionEditor.addAAPosition()">Add</button>
        </div>


        <table class="data-table data-table--compact text-white mb-3">
            <thead>
                <tr>
                    <th>#</th>
                    <th>X</th>
                    <th>Y</th>
                    <th>Z</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(aaPosition, index) in missionEditor.aaPositionsToShow" :key="aaPosition.id">
                    <td>#{{ index }}</td>
                    <td>
                        <BaseInput :id="'aa-position-x-' + aaPosition.id"
                        class="w-24" :model-value="aaPosition.position.x"
                            @update:modelValue="missionEditor.updateAAPosition({ ...aaPosition, position: { ...aaPosition.position, x: $event } })" />
                    </td>
                    <td>
                        <BaseInput :id="'aa-position-y-' + aaPosition.id"
                        class="w-24" :model-value="aaPosition.position.y"
                            @update:modelValue="missionEditor.updateAAPosition({ ...aaPosition, position: { ...aaPosition.position, y: $event } })" />
                    </td>
                    <td>
                        <BaseInput :id="'aa-position-z-' + aaPosition.id"
                        class="w-24" :model-value="aaPosition.position.z"
                            @update:modelValue="missionEditor.updateAAPosition({ ...aaPosition, position: { ...aaPosition.position, z: $event } })" />
                    </td>
                    <td>
                        <button @click="missionEditor.removeAAPosition(aaPosition.id)"
                            class="button button--danger">Remove</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
</template>


<script setup lang="ts">
import { useMissionEditor } from '../../../../stores/missionEditor';
import BaseInput from '../../../../components/BaseInput.vue';

const missionEditor = useMissionEditor()

</script>

<style scoped>
.mission-editor-sidebar-aa-positions {
    @apply w-full;
}

.mission-editor-sidebar-aa-positions__add {
    @apply flex items-center gap-2 w-full;
}
</style>