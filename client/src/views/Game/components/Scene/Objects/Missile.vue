<template>
    <TresGroup :position="missile.position" :quaternion="missile.quaternion">

        <Suspense v-if="!missile.isDestroyed">
            <GLTFModel :path="modelPath"  :rotation="[0, Math.PI / 2, 0]"/>
        </Suspense>

        <Sound :url="soundUrl" loop :volume="2" v-if="!missile.isDestroyed" />
        <Sound url="/explosion.mp3" v-if="missile.exploded" :volume="2" />
        <Smoke :position="missile.position" :color="0xc0c0c0" :particle-size="10" />
    </TresGroup>
</template>

<script setup lang="ts">
import { TresObject, useRenderLoop, useTres, } from '@tresjs/core';
import { GLTFModel } from '@tresjs/cientos'
import { computed, ref } from 'vue';
import Sound from './Sound.vue';
import { GuidedMissileState } from '../../../../../models/sockets.model';
import Smoke from './Smoke.vue';

const props = defineProps<{
    missile: GuidedMissileState,
}>();

const infoPlane = ref<TresObject | null>(null);
const { camera } = useTres(); // Камера
const { onLoop } = useRenderLoop(); // Рендер-цикл

const soundUrl = computed(() => '/missile_heavy.mp3')

const modelPath = computed(() => {
    return `${import.meta.env.VITE_APP_STATIC_URL}/flight-objects/Missile-M.gltf`;
})


onLoop(() => {
    // Плоскость с текстурой всегда смотрит на камеру
    if (infoPlane.value && camera.value) {
        infoPlane.value.lookAt(camera.value.position);
    }
});
</script>