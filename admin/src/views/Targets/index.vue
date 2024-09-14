<template>
    <div class="targets">
        <div class="targets__header">
            <h1 class="targets__title">Targets</h1>
            <button @click="createTarget" class="targets__create-btn">Create target</button>
        </div>

        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>RCS, m^2</th>
                    <th>Temperature, °C</th>
                    <th>Size, m</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="target in targets" :key="target.id">
                    <td>{{ target.id }}</td>
                    <td>{{ target.name }}</td>
                    <td>{{ target.rcs }}</td>
                    <td>{{ target.temperature }}</td>
                    <td>{{ target.size }}</td>
                    <td>
                        <button @click="editTarget(target.id)"
                            class="targets__edit-btn mr-2">Edit</button>
                        <button @click="targetStore.deleteTarget(target.id)" class="targets__delete-btn">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <TargetEdit v-show="isOpenPopup" @closePopup="closePopup" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTargets } from '../../stores/targets';
import TargetEdit from './components/TargetEdit.vue';

const targetStore = useTargets();
const { targets } = storeToRefs(targetStore)

const isOpenPopup = ref(false)

const createTarget = () => {
    targetStore.setTarget(null)
    isOpenPopup.value = true
}
const editTarget = (id: number) => {
    targetStore.setTarget(id)
    isOpenPopup.value = true
}

const closePopup = () => {
    targetStore.setTarget(null)
    isOpenPopup.value = false
}

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