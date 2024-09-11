<template>
    <div class="aas">
        <div class="aas__header">
            <h1 class="aas__title">AAs</h1>
            <button class="aas__create-btn" @click="createAA">Create AA</button>
        </div>

        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="aa in aas" :key="aa.id">
                    <td>{{ aa.id }}</td>
                    <td>{{ aa.name }}</td>
                    <td>
                        <button @click="editAA(aa.id)" class="aas__edit-btn">Edit</button>
                        <button @click="deleteAA(aa.id)" class="aas__delete-btn">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAAs } from '../../stores/aas';

const aaStore = useAAs();
const { aas } = storeToRefs(aaStore)

onMounted(() => {
    aaStore.getAAs()
})
const createAA = () => {
    console.log('Create new mission');
};

const editAA = (id: number) => {
    console.log('Edit mission with ID:', id);
};

const deleteAA = (id: number) => {
    console.log('Delete mission with ID:', id);
};
</script>

<style scoped>
.aas {
    @apply p-4;
}

.aas__header {
    @apply flex justify-between items-center mb-4;
}

.aas__title {
    @apply text-2xl font-bold;
}

.aas__create-btn {
    @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600;
}

.aas__edit-btn {
    @apply text-white bg-green-500 hover:bg-green-600 px-2 py-1 rounded;
}

.aas__delete-btn {
    @apply text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded;
}
</style>