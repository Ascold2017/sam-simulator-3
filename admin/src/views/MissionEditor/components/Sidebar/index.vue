<template>
    <aside class="mission-editor-sidebar">
        
        <section class="flex mb-6">
            <BaseInput id="mission-name" v-model="missionName" label="Mission Name" placeholder="Enter mission name" />
            <BaseInput id="mission-duration" v-model.number="missionDuration" label="Mission duration, s" placeholder="Enter duration" />

            <BaseSelect id="map-select" class="ml-auto" v-model.number="mapId" :options="mapsOptions" label="Map" />
        </section>


        <AAPositions class="mb-6" />

        <Targets class="mb-6" />

        <button @click="onSave" class="mission-editor-sidebar__save-btn">Save</button>
    </aside>

</template>

<script setup lang="ts">
import BaseInput from '../../../../components/BaseInput.vue';
import BaseSelect from '../../../../components/BaseSelect.vue';
import AAPositions from './AAPositions.vue';
import Targets from './Targets.vue';
import { computed, onMounted } from 'vue';
import { useMaps } from '../../../../stores/maps';
import { storeToRefs } from 'pinia';
import { useMissionEditor } from '../../../../stores/missionEditor/index';
import { useTargets } from '../../../../stores/targets';
import { useRouter } from 'vue-router';

const router = useRouter()
const mapsStore = useMaps();
const targetsStore = useTargets()
const missionEditor = useMissionEditor()
const { maps } = storeToRefs(mapsStore)
const { mapId, missionName, missionDuration } = storeToRefs(missionEditor)

const mapsOptions = computed(() =>
    maps.value.map(map => ({ label: map.name, value: map.id }))
);

async function onSave() {
    try {
        const id = await missionEditor.saveMission()
        router.push({ name: 'missionEdit', params: { id } })
    } catch (error) {
        console.error(error)
    }
}


onMounted(() => {
    mapsStore.getMaps()
    targetsStore.getTargets()
})

</script>

<style scoped>
.mission-editor-sidebar {
    @apply p-4 bg-gray-800 flex flex-col border-t-2 border-gray-700;
    width: 700px;
    overflow-y: auto;
    overflow-x: hidden;
}

.mission-editor-sidebar__save-btn {
    @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 block;
}


.mission-editor-sidebar__action-btn {
    @apply bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 block w-full;
}
</style>
