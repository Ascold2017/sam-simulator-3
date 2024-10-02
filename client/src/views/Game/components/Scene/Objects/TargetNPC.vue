<template>
    <TresGroup :position="targetNPC.position" :quaternion="targetNPC.quaternion">
        <Suspense v-if="!targetNPC.isDestroyed && modelPath">
            <GLTFModel :path="modelPath" />
        </Suspense>

        <Sound :url="soundPath" loop :volume="0.5" v-if="!targetNPC.isDestroyed && soundPath" />
        <Smoke :enabled="targetNPC.isKilled" :position="targetNPC.position" :color="0x696969" :particle-size="20" />
    </TresGroup>
</template>

<script setup lang="ts">
import { ParsedTargetNPCState } from '../../../../../stores/game';
import { GLTFModel } from '@tresjs/cientos'
import { computed } from 'vue';
import Sound from './Sound.vue';
import Smoke from './Smoke.vue';

const props = defineProps<{
    targetNPC: ParsedTargetNPCState,
}>();

const modelPath = computed(() => {
    if (!props.targetNPC.targetEntity) return '';
    return `${import.meta.env.VITE_APP_STATIC_URL}/flight-objects/${props.targetNPC.targetEntity.modelName}.gltf`;
})
const soundPath = computed(() => {
    if (!props.targetNPC.targetEntity) return '';
    return `${import.meta.env.VITE_APP_STATIC_URL}/flight-objects/${props.targetNPC.targetEntity.soundName}.mp3`;
})
</script>