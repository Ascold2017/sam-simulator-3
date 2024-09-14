<template>

    <section class="aa-edit">
        <BaseInput id="aa-name" v-model="currentAA.name" label="AA Name" placeholder="Enter AA name" class="mb-3" />
        <BaseSelect id="aa-type" v-model="currentAA.type" label="AA Type" :options="[
            { label: 'SAM with Active missiles', value: 'active-missile' },
            { label: 'Gun', value: 'gun' },
        ]" class="mb-3" />
        <BaseInput id="aa-reload-time" v-model="currentAA.reloadTime" label="Reload time"
            placeholder="Enter reload time, s" class="mb-3" />
        <BaseInput id="aa-ammo-max-range" v-model="currentAA.ammoMaxRange" label="Ammo max range"
            placeholder="Enter ammo max range, m" class="mb-3" />
        <BaseInput id="aa-ammo-velocity" v-model="currentAA.ammoVelocity" label="Ammo  velocity"
            placeholder="Enter ammo velocity, m/s" class="mb-3" />
        <BaseInput id="aa-view-angle" v-model="currentAA.viewAngle" label="View angle (capture angle)"
            placeholder="Enter view angle, degrees" />



        <div class="flex justify-end mt-6">
            <button class="button" @click="onSave">Save</button>
        </div>

    </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import BaseInput from '../../components/BaseInput.vue';
import { useAAs } from '../../stores/aas';
import { onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseSelect from '../../components/BaseSelect.vue';

const route = useRoute()
const router = useRouter()
const aaStore = useAAs();
const { currentAA } = storeToRefs(aaStore)

const onSave = async () => {
    const id = await aaStore.saveAA()
    router.push({ name: 'aaEdit', params: { id } })
}
onMounted(() => {
    if (route.params.id) {
        aaStore.getAA(+route.params.id)
    }
})

onUnmounted(() => {
    aaStore.$reset()
})
</script>

<style lang="css" scoped>
.aa-edit {
    @apply p-4 max-w-4xl mx-auto;
}
</style>