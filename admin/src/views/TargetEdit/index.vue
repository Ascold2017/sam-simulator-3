<template>

    <section class="target-edit">
        <BaseInput id="target-name" v-model="currentTarget.name" label="Target Name" placeholder="Enter target name" />
        <BaseInput id="target-rcs" v-model="currentTarget.rcs" label="Target RCS" placeholder="Enter target RCS, m^2" />
        <BaseInput id="target-temperature" v-model="currentTarget.temperature" label="Target temperature"
            placeholder="Enter target temperature, C" />
        <BaseInput id="target-size" v-model="currentTarget.size" label="Target size"
            placeholder="Enter target size, m" />
        <div class="flex justify-end mt-6">
            <button class="button" @click="onSave">Save</button>
        </div>
       
    </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import BaseInput from '../../components/BaseInput.vue';
import { useTargets } from '../../stores/targets';
import { onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()
const targetStore = useTargets();
const { currentTarget } = storeToRefs(targetStore)

const onSave = async () => {
    const id = await targetStore.saveTarget()
    router.push({ name: 'targetEdit', params: { id } })
}
onMounted(() => {
    if (route.params.id) {
        targetStore.getTarget(+route.params.id)
    }
})

onUnmounted(() => {
    targetStore.$reset()
})
</script>

<style lang="css" scoped>
.target-edit {
    @apply p-4 max-w-4xl mx-auto;
}
</style>