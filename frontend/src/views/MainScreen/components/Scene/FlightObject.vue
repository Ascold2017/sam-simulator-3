<template>
    <TresGroup :position="[flightObject.position.x, flightObject.position.y, flightObject.position.z]">

        <!-- Объект -->
        <TresMesh>
            <TresSphereGeometry :radius="2" />
            <TresMeshStandardMaterial :color="0xff0000" />

            <!-- Плоскость с текстурой -->
            <TresMesh v-if="camera && flightObject.isCaptured" ref="infoPlane"
                :scale="[infoPlaneScale, infoPlaneScale, infoPlaneScale]">
                <TresPlaneGeometry :args="[1, 1]" />
                <TresMeshBasicMaterial :map="createOutlineTexture()" transparent :side="0" />
            </TresMesh>
        </TresMesh>

        <!-- Шлейф -->
        <TresPoints ref="trailMesh">
            <TresBufferGeometry>
                <TresBufferAttribute :itemSize="3" />
            </TresBufferGeometry>
            <TresPointsMaterial :size="10" :color="0xffffff" :opacity="0.7" />
        </TresPoints>

    </TresGroup>
</template>

<script setup lang="ts">
import { BufferAttribute, CanvasTexture, Vector3 } from 'three';
import { ParsedFlightObject } from '../../../../stores/game';
import { useRenderLoop, useTres } from '@tresjs/core';
import { computed, ref } from 'vue';

const props = defineProps<{
    flightObject: ParsedFlightObject,
    prevState?: ParsedFlightObject // Добавляем предыдущее состояние объекта
}>();

const infoPlane = ref(null);
const trailMesh = ref(null); // Ссылка на шлейф
const positions = ref(new Float32Array(500 * 3)); // Массив для позиций частиц (длина шлейфа)

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

    // Текущая позиция объекта
    const currentPosition = new Vector3(props.flightObject.position.x, props.flightObject.position.y, props.flightObject.position.z);
    const previousPosition = props.prevState
        ? new Vector3(props.prevState.position.x, props.prevState.position.y, props.prevState.position.z)
        : new Vector3(props.flightObject.position.x, props.flightObject.position.y, props.flightObject.position.z);

    // Если предыдущая и текущая позиции различаются, обновляем шлейф
    if (!currentPosition.equals(previousPosition)) {
        // Сдвигаем предыдущие позиции назад в массиве
        for (let i = positions.value.length - 3; i > 0; i -= 3) {
            positions.value[i] = positions.value[i - 3];
            positions.value[i + 1] = positions.value[i - 2];
            positions.value[i + 2] = positions.value[i - 1];
        }

        // Устанавливаем новую позицию в начало массива
        positions.value[0] = currentPosition.x;
        positions.value[1] = currentPosition.y;
        positions.value[2] = currentPosition.z;


        // Обновляем атрибуты геометрии (шлейфа)
      if (trailMesh.value && trailMesh.value.geometry) {
        const attribute = new BufferAttribute(positions.value, 3);
        trailMesh.value.geometry.setAttribute('position', attribute);
        trailMesh.value.geometry.attributes.position.needsUpdate = true;
      }
    }
});
</script>