<template>
    <TresPerspectiveCamera :fov="CAMERA_SETTINGS.fov" :far="CAMERA_SETTINGS.far" :aspect="CAMERA_SETTINGS.aspect"
        :zoom="zoom" :position="cameraPosition"
        :key="zoom + cameraPosition.join(',') + direction.azimuth + direction.elevation" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useGameStore, CAMERA_SETTINGS } from '../../../../stores/game';
import { computed, onMounted } from 'vue';
import { useLoop } from '@tresjs/core';
import { Vector3 } from 'three';

const gameStore = useGameStore();
const { currentAA, direction, viewMode, parsedTargetNPCs } = storeToRefs(gameStore);

const currentTarget = computed(() => {
    return parsedTargetNPCs.value.find(t => t.id === currentAA.value?.capturedTargetId);
});

const { render } = useLoop();

const zoom = computed(() => {
    return viewMode.value === 'capture' ? CAMERA_SETTINGS.captureZoom : CAMERA_SETTINGS.defaultZoom;
});

// Смещение камеры по радиусу (по оси z от currentAA.position)
const radius = 15; // Радиус для вращения камеры вокруг зенитки

// Смещение камеры относительно currentAA.position
const cameraPosition = computed<[number, number, number]>(() => {
    if (!currentAA.value) return [0, 0, 0];

    // Берем текущую позицию зенитки
    const basePosition = new Vector3(...currentAA.value.position);

    // Вычисляем новую позицию камеры в зависимости от азимута и высоты
    // Вычисляем новое смещение камеры с учетом азимута и возвышения
    const offsetX = radius * Math.cos(direction.value.elevation) * Math.sin(direction.value.azimuth);
    const offsetZ = radius * Math.cos(-direction.value.elevation) * Math.cos(direction.value.azimuth);
    const offsetY = radius * Math.sin(-direction.value.elevation);

    // Устанавливаем новую позицию камеры
    const cameraPos = basePosition.clone();
    cameraPos.x += offsetX;
    cameraPos.y += offsetY; // Учитываем базовую высоту
    cameraPos.z += offsetZ;

    return cameraPos.toArray();
});

onMounted(() => {
    render(({ renderer, scene, camera }) => {
        if (currentTarget.value) {
            camera.lookAt(new Vector3(...currentTarget.value.position));
        } else  if (currentAA.value) {
            // Камера вращается вокруг currentAA.position с заданным смещением
            const aaPosition = new Vector3(...currentAA.value.position);

            // Камера всегда смотрит на позицию зенитки
            camera.lookAt(aaPosition);  // Направляем камеру на зенитку
        }
        gameStore.cameraLink = camera;

        renderer.render(scene, camera);
    });
});
</script>
