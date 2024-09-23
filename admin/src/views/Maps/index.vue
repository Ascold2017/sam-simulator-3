<template>
    <div class="maps">
        <div class="maps__header">
            <h1 class="maps__title">Maps</h1>
            <router-link class="maps__create-btn" :to="{ name: 'mapCreate' }">Create map</router-link>
        </div>

        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Filename</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="map in maps" :key="map.id">
                    <td>{{ map.id }}</td>
                    <td>{{ map.name }}</td>
                    <td>{{ map.filename }}</td>
                    <td>
                        <router-link :to="{ name: 'mapEdit', params: { id: map.id } }"
                            class="maps__edit-btn mr-2">Edit</router-link>
                        <button @click="mapsStore.deleteMap(map.id)" class="maps__delete-btn">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useMaps } from '../../stores/maps';

const mapsStore = useMaps();
const { maps } = storeToRefs(mapsStore)

onMounted(() => {
    mapsStore.getMaps()
})

</script>

<style scoped>
.maps {
    @apply p-4;
}

.maps__header {
    @apply flex justify-between items-center mb-4;
}

.maps__title {
    @apply text-2xl font-bold;
}

.maps__create-btn {
    @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600;
}

.maps__edit-btn {
    @apply text-white bg-green-500 hover:bg-green-600 px-2 py-1 rounded;
}

.maps__delete-btn {
    @apply text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded;
}
</style>