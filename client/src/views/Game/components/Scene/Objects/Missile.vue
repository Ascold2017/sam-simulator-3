<template>
    <TresGroup :position="missile.position" :quaternion="missile.quaternion">

        <Suspense v-if="!missile.isDestroyed">
            <GLTFModel :path="modelPath"  :rotation="[0, Math.PI / 2, 0]"/>
        </Suspense>

        <Sound :url="soundPath" loop :volume="2" v-if="!missile.isDestroyed" />
        <Sound url="/explosion.mp3" v-if="missile.exploded" :volume="2" />
        <Smoke :enabled="missile.isActiveRange" :position="missile.position" :color="0xc0c0c0" :particle-size="10" />
    </TresGroup>
</template>zx

<script setup lang="ts">
import { GLTFModel } from '@tresjs/cientos'
import { computed } from 'vue';
import Sound from './Sound.vue';
import { MissileState } from '../../../../../models/sockets.model';
import Smoke from './Smoke.vue';

defineProps<{
    missile: MissileState,
}>();


const modelPath = computed(() => {
    return `${import.meta.env.VITE_APP_STATIC_URL}/flight-objects/Missile-M.gltf`;
})

const soundPath = computed(() => {
    return `${import.meta.env.VITE_APP_STATIC_URL}/flight-objects/missile_heavy.mp3`;
})

</script>