<template>
    <TresMesh :position="[flightObject.position.x, flightObject.position.y, flightObject.position.z]">
        <TresSphereGeometry :radius="2" />
        <TresMeshStandardMaterial :color="0xff0000" />

        <!-- Плоскость с текстурой -->
        <TresMesh v-if="camera && flightObject.isCaptured" ref="infoPlane"
            :scale="[infoPlaneScale, infoPlaneScale, infoPlaneScale]">
            <TresPlaneGeometry :args="[1, 1]" />
            <TresMeshBasicMaterial :map="createOutlineTexture()" transparent :side="0" />
        </TresMesh>
    </TresMesh>
</template>

<script setup lang="ts">
import { CanvasTexture } from 'three';
import { ParsedFlightObject } from '../../../../stores/game';
import { TresObject, useRenderLoop, useTres } from '@tresjs/core';
import { computed, ref } from 'vue';

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