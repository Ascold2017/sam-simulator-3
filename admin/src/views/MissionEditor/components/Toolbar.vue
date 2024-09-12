<template>
    <div class="mission-editor-toolbar">
        <BaseInput id="mission-name" v-model="missionName" label="Mission Name" placeholder="Enter mission name" />

        <BaseSelect id="map-select" v-model.number="mapId" :options="mapsOptions" label="Map" />
        <button @click="missionEditor.saveMission" class="mission-editor-toolbar__save-btn">Save</button>
    </div>

</template>

<script setup lang="ts">
import BaseInput from '../../../components/BaseInput.vue';
import BaseSelect from '../../../components/BaseSelect.vue';
import { computed, onMounted, ref } from 'vue';
import { useMaps } from '../../../stores/maps';
import { storeToRefs } from 'pinia';
import { useMissionEditor } from '../../../stores/missionEditor';

const mapsStore = useMaps();
const missionEditor = useMissionEditor()
const { maps } = storeToRefs(mapsStore)
const { mapId, missionName } = storeToRefs(missionEditor)

const mapsOptions = computed(() =>
  maps.value.map(map => ({ label: map.name, value: map.id }))
);

onMounted(() => {
    mapsStore.getMaps()
})

</script>

<style scoped>
.mission-editor-toolbar {
    @apply flex items-center p-4 bg-gray-800;
}

.mission-editor-toolbar__input {
    @apply bg-gray-700 text-white px-4 py-2 rounded mr-4;
}

.mission-editor-toolbar__select {
    @apply bg-gray-700 text-white px-4 py-2 rounded mr-4;
}

.mission-editor-toolbar__save-btn {
    @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ml-auto;
}
</style>
