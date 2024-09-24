<template>
    <aside class="map-editor-sidebar">
        
            <BaseInput id="map-name" v-model="mapName" label="Map Name" placeholder="Enter map name" />
            <BaseInput id="map-filename" v-model="mapFilename" label="Map filename" placeholder="Enter map filename" />
            <BaseInput id="map-size" v-model.number="mapSize" label="Map size" placeholder="Enter map size, m" />



        <button @click="onSave" class="map-editor-sidebar__save-btn mt-6">Save</button>
    </aside>

</template>

<script setup lang="ts">
import BaseInput from '../../../components/BaseInput.vue';
import { useMaps } from '../../../stores/maps';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const router = useRouter()
const mapsStore = useMaps();
const { mapName, mapFilename, mapSize } = storeToRefs(mapsStore)



async function onSave() {
    try {
        const id = await mapsStore.saveMap()
        router.push({ name: 'mapEdit', params: { id } })
    } catch (error) {
        console.error(error)
    }
}

</script>

<style scoped>
.map-editor-sidebar {
    @apply p-4 bg-gray-800 flex flex-col border-t-2 border-gray-700;
    width: 400px;
    overflow-y: auto;
    overflow-x: hidden;
}

.map-editor-sidebar__save-btn {
    @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 block;
}


.map-editor-sidebar__action-btn {
    @apply bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 block w-full;
}
</style>
