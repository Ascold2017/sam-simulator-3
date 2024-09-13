<template>
    <div class="mission-editor-toolbar">
        <BaseInput id="mission-name" v-model="missionName" label="Mission Name" placeholder="Enter mission name" />

        <BaseSelect id="map-select" v-model.number="mapId" :options="mapsOptions" label="Map" />

        <button @click="missionEditor.addAAPosition"  class="mission-editor-toolbar__action-btn">Add
            AA position</button>
        <TargetControls />

        <button @click="missionEditor.saveMission" :disabled="!isChanged"
            class="mission-editor-toolbar__save-btn">Save</button>
    </div>

</template>

<script setup lang="ts">
import TargetControls from './TargetControls.vue';
import BaseInput from '../../../../components/BaseInput.vue';
import BaseSelect from '../../../../components/BaseSelect.vue';
import { computed, onMounted } from 'vue';
import { useMaps } from '../../../../stores/maps';
import { storeToRefs } from 'pinia';
import { useMissionEditor } from '../../../../stores/missionEditor';

const mapsStore = useMaps();
const missionEditor = useMissionEditor()
const { maps } = storeToRefs(mapsStore)
const { mapId, missionName, isChanged } = storeToRefs(missionEditor)

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


.mission-editor-toolbar__action-btn {
    @apply bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2;
}

/* Стили для попапа */
.popup__add-btn {
    @apply bg-green-500 text-white px-4 py-2 rounded;
}

.popup__cancel-btn {
    @apply bg-red-500 text-white px-4 py-2 rounded;
}
</style>
