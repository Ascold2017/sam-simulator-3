<template>
    <Popup @close="emit('close-popup')">
        <template #header>
            Edit AA
        </template>

        <template #content>
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
            placeholder="Enter view angle, rads" />



        <div class="flex justify-end mt-6">
            <button class="button" @click="onSave">Save</button>
        </div>
        </template>
    </Popup>
</template>

<script setup lang="ts">
import Popup from '../../../components/Popup.vue';

import { storeToRefs } from 'pinia';
import BaseInput from '../../../components/BaseInput.vue';
import { useAAs } from '../../../stores/aas';
import BaseSelect from '../../../components/BaseSelect.vue';

const emit = defineEmits(['close-popup'])
const aaStore = useAAs();
const { currentAA } = storeToRefs(aaStore)

const onSave = async () => {
    await aaStore.saveAA()
    emit('close-popup')
}
</script>