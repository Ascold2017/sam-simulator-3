<template>
    <TresGroup :position="[flightObject.position.x, flightObject.position.y, flightObject.position.z]"
        :rotation="[rotation.x, rotation.y, rotation.z]">

        <Cone v-if="flightObject.type === 'active-missile'" :args="[2, 5, 10]" color="red" />

        <Sphere v-if="flightObject.type === 'target'" :args="[5, 8, 8]" color="blue" />

        <!-- Плоскость с текстурой -->
        <TresMesh v-if="camera && flightObject.isCaptured" ref="infoPlane"
            :scale="[infoPlaneScale, infoPlaneScale, infoPlaneScale]">
            <TresPlaneGeometry :args="[1, 1]" />
            <TresMeshBasicMaterial :map="createOutlineTexture()" transparent :side="0" />
        </TresMesh>
    </TresGroup>
</template>

<script setup lang="ts">
import { CanvasTexture, Euler, Matrix4, Vector3 } from 'three';
import { ParsedFlightObject } from '../../../../stores/game';
import { TresObject, useRenderLoop, useTres, } from '@tresjs/core';
import { Cone, Sphere } from '@tresjs/cientos'
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


const rotation = computed(() => {
    const velocity = new Vector3(
        props.flightObject.velocity.x,
        props.flightObject.velocity.y,
        props.flightObject.velocity.z
    );
    const direction = velocity.normalize();
    const up = new Vector3(0, 1, 0);
    // Векторная матрица для поворота модели
    const matrix = new Matrix4();
    matrix.lookAt(new Vector3(0, 0, 0), direction, up);

    const rotationEuler = new Euler();
    rotationEuler.setFromRotationMatrix(matrix);

    // Корректируем поворот по оси X, чтобы конус летел вершиной вперед
    rotationEuler.x += Math.PI / 2;
    return rotationEuler;
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