<template>
    <!-- Нет необходимости в шаблоне, так как компонент будет управлять только камерой -->
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue';
import {  useRenderLoop } from '@tresjs/core';


const props = withDefaults(defineProps<{
    lookSpeed: number;
    minElevation: number;
    maxElevation: number;
}>(), {
    lookSpeed: 0.2,
    minElevation: 0,
    maxElevation: Math.PI
})

const emit = defineEmits<{ updateDirection: [direction: { azimuth: number; elevation: number }] }>()

const currentAzimuth = ref(0);
const currentElevation = ref(0);

const rotationSpeedX = ref(0);
const rotationSpeedY = ref(0);

// Подключаем камеру TresJS
const { onLoop } = useRenderLoop()

// Функция для нормализации угла
const normalizeAngle = (angle: number): number => {
    if (angle < 0) return angle + 2 * Math.PI;
    if (angle > 2 * Math.PI) return 0;
    return angle;
};

// Обновляем вращение камеры на основе мыши
const updateCameraRotation = () => {
    currentAzimuth.value -= rotationSpeedX.value;
    currentAzimuth.value = normalizeAngle(currentAzimuth.value);

    currentElevation.value -= rotationSpeedY.value;
    currentElevation.value = Math.max(props.minElevation, Math.min(props.maxElevation, currentElevation.value));

    emit('updateDirection', {
        azimuth: currentAzimuth.value,
        elevation: currentElevation.value
    });
};

// Обработчик для движения мыши
const onMouseMove = (event: MouseEvent) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const distanceX = event.clientX - centerX;
    const distanceY = event.clientY - centerY;

    rotationSpeedX.value = (distanceX / centerX) * props.lookSpeed;
    rotationSpeedY.value = (distanceY / centerY) * props.lookSpeed;
};

onLoop(() => updateCameraRotation())


// Очистка при удалении компонента
onBeforeUnmount(() => {
    document.body.removeEventListener('mousemove', onMouseMove);
});
</script>