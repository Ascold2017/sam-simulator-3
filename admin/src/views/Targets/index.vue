<template>
    <div class="targets">
        <div class="targets__header">
            <h1 class="targets__title">Targets</h1>
            <button class="targets__create-btn" @click="createAA">Create target</button>
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
                <tr v-for="aa in targets" :key="aa.id">
                    <td>{{ aa.id }}</td>
                    <td>{{ aa.name }}</td>
                    <td>
                        <button @click="editAA(aa.id)" class="targets__edit-btn">Edit</button>
                        <button @click="deleteAA(aa.id)" class="targets__delete-btn">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTargets } from '../../stores/targets';

const targetstore = useTargets();
const { targets } = storeToRefs(targetstore)

onMounted(() => {
    targetstore.getTargets()
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
.targets {
    @apply p-4;
}

.targets__header {
    @apply flex justify-between items-center mb-4;
}

.targets__title {
    @apply text-2xl font-bold;
}

.targets__create-btn {
    @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600;
}

.targets__edit-btn {
    @apply text-white bg-green-500 hover:bg-green-600 px-2 py-1 rounded;
}

.targets__delete-btn {
    @apply text-white bg-red-500 hover:bg-red-600 px-2 py-1 rounded;
}
</style>