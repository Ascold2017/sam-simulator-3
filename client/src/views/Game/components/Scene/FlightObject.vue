<template>
    <TresGroup :position="[flightObject.position.x, flightObject.position.y, flightObject.position.z]" :quaternion="flightObject.quaternion">

        <Suspense v-if="modelPath && !flightObject.isDestroyed">
            <GLTFModel :path="modelPath"  />
        </Suspense>

        <Sound :url="soundUrl" loop :volume="flightObject.type === 'missile' ? 2 : 0.5"
            v-if="!flightObject.isDestroyed" />
        <Sound url="/explosion.mp3" v-if="flightObject.type === 'missile' && flightObject.isDestroyed" :volume="2" />

        <!-- Плоскость с текстурой -->
        <TresMesh v-if="camera && flightObject.isCaptured" ref="infoPlane"
            :scale="[infoPlaneScale, infoPlaneScale, infoPlaneScale]">
            <TresPlaneGeometry :args="[1, 1]" />
            <TresMeshBasicMaterial :map="createOutlineTexture()" transparent :side="0" />
        </TresMesh>
    </TresGroup>

</template>

<script setup lang="ts">
import { CanvasTexture} from 'three';
import { ParsedFlightObject } from '../../../../stores/game';
import { TresObject, useRenderLoop, useTres, } from '@tresjs/core';
import { GLTFModel, Cone } from '@tresjs/cientos'
import { computed, ref } from 'vue';
import Sound from './Sound.vue';

const props = defineProps<{
    flightObject: ParsedFlightObject,
}>();

const infoPlane = ref<TresObject | null>(null);
const { camera } = useTres(); // Камера
const { onLoop } = useRenderLoop(); // Рендер-цикл

// Масштабируем плоскость с текстурой
const infoPlaneScale = computed(() => {
    const distance = camera.value?.position.distanceTo(props.flightObject.position) || 0;
    const fixedSize = 10;
    return distance / fixedSize;
});

const soundUrl = computed(() => props.flightObject.type === 'missile' ? '/missile_heavy.mp3' : '/airplane.mp3')

const modelPath = computed(() => {
    if (props.flightObject.type === 'missile') {
        return `${import.meta.env.VITE_APP_STATIC_URL}/flight-objects/Missile-M.gltf`;
    } else {
        return `${import.meta.env.VITE_APP_STATIC_URL}/flight-objects/Drone-M.gltf`;
    }
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
    // Плоскость с текстурой всегда смотрит на камеру
    if (infoPlane.value && camera.value) {
        infoPlane.value.lookAt(camera.value.position);
    }
});
</script>