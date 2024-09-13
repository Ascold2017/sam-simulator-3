<template>
    <section class="mission-editor-sidebar-aa-positions">
        <div class="mission-editor-sidebar-aa-positions__add mb-3">
            <h4 class="title text-white">AA Positions</h4>
            <button class="button ml-auto"  @click="missionEditor.addAAPosition()" >Add</button>
        </div>

       
        <table class="data-table text-white mb-3">
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
                    <td>{{ aaPosition.position.x.toFixed(0) }}</td>
                    <td>{{ aaPosition.position.y.toFixed(0) }}</td>
                    <td>{{ aaPosition.position.z.toFixed(0) }}</td>
                    <td>
                        <button @click="missionEditor.removeAAPosition(aaPosition.id)" class="button button--danger">Remove</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
</template>


<script setup lang="ts">
import { useMissionEditor } from '../../../../stores/missionEditor';

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