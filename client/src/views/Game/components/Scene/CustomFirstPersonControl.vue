<template>
    <!-- Нет необходимости в шаблоне, так как компонент будет управлять только камерой -->
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import {  useRenderLoop } from '@tresjs/core';
import { useGameStore } from '../../../../stores/game';
import { storeToRefs } from 'pinia';


const props = withDefaults(defineProps<{
    minElevation: number;
    maxElevation: number;
}>(), {
    minElevation: 0,
    maxElevation: Math.PI
})

const emit = defineEmits<{ updateDirection: [direction: { azimuth: number; elevation: number }] }>()
const gameStore = useGameStore();
const { direction, viewMode } = storeToRefs(gameStore);

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
    const updated = {
        azimuth: normalizeAngle(direction.value.azimuth - rotationSpeedX.value),
        elevation: Math.max(props.minElevation, Math.min(props.maxElevation, direction.value.elevation - rotationSpeedY.value))
    }
    direction.value = updated;
};

// Обработчик для движения мыши
const onMouseMove = (event: MouseEvent) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const distanceX = event.clientX - centerX;
    const distanceY = event.clientY - centerY;

    rotationSpeedX.value = (distanceX / centerX) * (viewMode.value === 'capture' ? 0.01 : 0.06);
    rotationSpeedY.value = (distanceY / centerY) * (viewMode.value === 'capture' ? 0.01 : 0.06);
};

onLoop(() => updateCameraRotation())

onMounted(() => {
    document.body.addEventListener('mousemove', onMouseMove);
})
// Очистка при удалении компонента
onBeforeUnmount(() => {
    document.body.removeEventListener('mousemove', onMouseMove);
});
</script>