<template>
    <Popup @close="emit('close-popup')">
        <template #header>
            Edit Target
        </template>

        <template #content>

            <BaseInput id="target-name" v-model="currentTarget.name" label="Target Name"
                placeholder="Enter target name" />
            <BaseInput id="target-modelName" v-model="currentTarget.modelName" label="Target model name"
                placeholder="Enter model name name" />
            <BaseInput id="target-soundName" v-model="currentTarget.soundName" label="Target sound name"
                placeholder="Enter sound name" />
            <BaseInput id="target-rcs" v-model="currentTarget.rcs" label="Target RCS"
                placeholder="Enter target RCS, m^2" />
            <BaseInput id="target-temperature" v-model="currentTarget.temperature" label="Target temperature"
                placeholder="Enter target temperature, °C" />
            <BaseInput id="target-size" v-model="currentTarget.size" label="Target size"
                placeholder="Enter target size, m" />


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
import { useTargets } from '../../../stores/targets';

const emit = defineEmits(['close-popup'])
const targetStore = useTargets();
const { currentTarget } = storeToRefs(targetStore)

const onSave = async () => {
    await targetStore.saveTarget()
    emit('close-popup')
}
</script>