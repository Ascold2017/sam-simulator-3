<template>
    <Popup @close="emit('close-popup')">
        <template #header>
            Edit AA
        </template>

        <template #content>
            <BaseInput id="aa-name" v-model="currentAA.name" label="AA Name" placeholder="Enter AA name" class="mb-3" />
            <BaseInput id="aa-ammo-count" v-model.number="currentAA.missileCount" label="Missiles count" placeholder="Enter count"
                class="mb-3" />
            <BaseInput id="aa-reload-time" v-model.number="currentAA.reloadTime" label="Reload time"
                placeholder="Enter reload time, s" class="mb-3" />
            <BaseInput id="aa-ammo-min-range" v-model.number="currentAA.missileMinRange" label="Missile min range"
                placeholder="Enter ammo min range, m" class="mb-3" />
            <BaseInput id="aa-ammo-max-range" v-model.number="currentAA.missileMaxRange" label="Missile max range"
                placeholder="Enter ammo max range, m" class="mb-3" />
            <BaseInput id="aa-ammo-velocity" v-model.number="currentAA.missileVelocity" label="Missile  velocity"
                placeholder="Enter ammo velocity, m/s" class="mb-3" />
            <BaseInput id="aa-ammo-kill-radius" v-model.number="currentAA.missileKillRadius" label="Missile kill radius"
                placeholder="Enter ammo kill radius, m" class="mb-3" />
            <BaseInput id="aa-ammo-max-overload" v-model.number="currentAA.missileMaxOverload" label="Missile max overload"
                placeholder="Enter ammo max overload, G" class="mb-3" />
            <BaseInput id="aa-capture-angle" v-model.number="currentAA.captureAngle" label="Capture angle"
                placeholder="Enter capture angle, rads" />
            <BaseInput id="aa-capture-channel-count" v-model.number="currentAA.captureChannelCount" label="Capture channel count"
                placeholder="Enter capture channel count" />



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

const emit = defineEmits(['close-popup'])
const aaStore = useAAs();
const { currentAA } = storeToRefs(aaStore)

const onSave = async () => {
    await aaStore.saveAA()
    emit('close-popup')
}
</script>