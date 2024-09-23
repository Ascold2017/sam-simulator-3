<template>
    <Popup @close="emit('close-popup')">
        <template #header>
            Edit AA
        </template>

        <template #content>
            <BaseInput id="aa-name" v-model="currentAA.name" label="AA Name" placeholder="Enter AA name" class="mb-3" />
            <BaseSelect id="aa-type" v-model="currentAA.type" label="AA Type" :options="[
                { label: 'SAM with Guided missiles', value: 'guided-missile' },
            ]" class="mb-3" />
            <BaseInput id="aa-ammo-count" v-model.number="currentAA.ammoCount" label="Ammo count" placeholder="Enter count"
                class="mb-3" />
            <BaseInput id="aa-reload-time" v-model.number="currentAA.reloadTime" label="Reload time"
                placeholder="Enter reload time, s" class="mb-3" />
            <BaseInput id="aa-ammo-min-range" v-model.number="currentAA.ammoMinRange" label="Ammo min range"
                placeholder="Enter ammo min range, m" class="mb-3" />
            <BaseInput id="aa-ammo-max-range" v-model.number="currentAA.ammoMaxRange" label="Ammo max range"
                placeholder="Enter ammo max range, m" class="mb-3" />
            <BaseInput id="aa-ammo-velocity" v-model.number="currentAA.ammoVelocity" label="Ammo  velocity"
                placeholder="Enter ammo velocity, m/s" class="mb-3" />
            <BaseInput id="aa-ammo-kill-radius" v-model.number="currentAA.ammoKillRadius" label="Ammo kill radius"
                placeholder="Enter ammo kill radius, m" class="mb-3" />
            <BaseInput id="aa-ammo-max-overload" v-model.number="currentAA.ammoMaxOverload" label="Ammo max overload"
                placeholder="Enter ammo max overload, G" class="mb-3" />
            <BaseInput id="aa-capture-angle" v-model.number="currentAA.captureAngle" label="Capture angle"
                placeholder="Enter capture angle, rads" />



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