<template>
    <div class="targets">
        <div class="targets__header">
            <h1 class="targets__title">Targets</h1>
            <router-link class="targets__create-btn" :to="{ name: 'targetCreate' }">Create target</router-link>
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
                <tr v-for="target in targets" :key="target.id">
                    <td>{{ target.id }}</td>
                    <td>{{ target.name }}</td>
                    <td>
                        <router-link :to="{ name: 'targetEdit', params: { id: target.id } }"
                            class="targets__edit-btn">Edit</router-link>
                        <button @click="targetStore.deleteTarget(target.id)" class="targets__delete-btn">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTargets } from '../../stores/targets';

const targetStore = useTargets();
const { targets } = storeToRefs(targetStore)

onMounted(() => {
    targetStore.getTargets()
})

onUnmounted(() => {
    targetStore.$reset()
})
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