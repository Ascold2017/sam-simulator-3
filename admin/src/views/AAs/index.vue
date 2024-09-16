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
                    <th>Type</th>
                    <th>Reload time, s</th>
                    <th>Ammo max range, m</th>
                    <th>Ammo velocity, m/s</th>
                    <th>Ammo kill radius, m</th>
                    <th>Capture angle, rad</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="aa in aas" :key="aa.id">
                    <td>{{ aa.id }}</td>
                    <td>{{ aa.name }}</td>
                    <td>{{ aa.type }}</td>
                    <td>{{ aa.reloadTime }}</td>
                    <td>{{ aa.ammoMaxRange }}</td>
                    <td>{{ aa.ammoVelocity }}</td>
                    <td>{{ aa.ammoKillRadius }}</td>
                    <td>{{ aa.captureAngle }}</td>
                    <td>
                        <button @click="editAA(aa.id)" class="aas__edit-btn mr-2">Edit</button>
                        <button @click="aaStore.deleteAA(aa.id)" class="aas__delete-btn">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <EditPopup v-show="isOpenPopup" @close-popup="closePopup" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useAAs } from '../../stores/aas';
import EditPopup from './components/EditPopup.vue';

const aaStore = useAAs();
const { aas } = storeToRefs(aaStore)

const isOpenPopup = ref(false)

const createAA = () => {
    aaStore.setAA(null)
    isOpenPopup.value = true
}
const editAA = (id: number) => {
    aaStore.setAA(id)
    isOpenPopup.value = true
}

const closePopup = () => {
    aaStore.setAA(null)
    isOpenPopup.value = false
}
onMounted(() => {
    aaStore.getAAs()
})
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