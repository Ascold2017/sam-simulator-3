<template>
    <TresGroup :position="targetNPC.position" :quaternion="targetNPC.quaternion">
        <template v-if="!targetNPC.isDestroyed">
            <Suspense>
                <GLTFModel :path="modelPath" :rotation="[0, Math.PI / 2, 0]" />
            </Suspense>

            <Sound :url="soundPath" loop :volume="0.5" />

            <TresMesh v-if="camera && targetNPC.isCaptured" ref="infoPlane"
                :scale="[infoPlaneScale, infoPlaneScale, infoPlaneScale]">
                <TresPlaneGeometry :args="[1, 1]" />
                <TresMeshBasicMaterial :map="createOutlineTexture()" transparent :side="0" />
            </TresMesh>
        </template>

        <Smoke v-if="targetNPC.isKilled" :position="targetNPC.position" :color="0x696969" :particle-size="20" />

    </TresGroup>

</template>

<script setup lang="ts">
import { CanvasTexture, Vector3 } from 'three';
import { ParsedTargetNPCState } from '../../../../../stores/game';
import { TresObject, useRenderLoop, useTres, } from '@tresjs/core';
import { GLTFModel } from '@tresjs/cientos'
import { computed, ref } from 'vue';
import Sound from './Sound.vue';
import Smoke from './Smoke.vue';

const props = defineProps<{
    targetNPC: ParsedTargetNPCState,
}>();

const infoPlane = ref<TresObject | null>(null);
const { camera } = useTres(); // Камера
const { onLoop } = useRenderLoop(); // Рендер-цикл

// Масштабируем плоскость с текстурой
const infoPlaneScale = computed(() => {
    const distance = camera.value?.position.distanceTo(new Vector3(...props.targetNPC.position)) || 0;
    const fixedSize = 10;
    return distance / fixedSize;
});

const modelPath = computed(() => {
    return `${import.meta.env.VITE_APP_STATIC_URL}/flight-objects/${props.targetNPC.targetEntity?.modelName}.gltf`;
})
const soundPath = computed(() => {
    return `${import.meta.env.VITE_APP_STATIC_URL}/flight-objects/${props.targetNPC.targetEntity?.soundName}.mp3`;
})


// Функция создания текстуры для плоскости
function createOutlineTexture() {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');

    if (context) {
        context.clearRect(0, 0, size, size);
        context.strokeStyle = 'red';
        context.lineWidth = 10;
        context.arc(size / 2, size / 2, size / 4, 0, 2 * Math.PI);
        context.stroke();
    }

    return new CanvasTexture(canvas);
}



onLoop(() => {
    console.log(props.targetNPC.entityId)
    // Плоскость с текстурой всегда смотрит на камеру
    if (infoPlane.value && camera.value) {
        infoPlane.value.lookAt(camera.value.position);
    }
});
</script>