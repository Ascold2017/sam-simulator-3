<template>
    <TresPoints v-for="(emitter, index) in emitters" :key="index" :geometry="emitter.geometry">
        <TresPointsMaterial :map="emitter.map" :size="50" :color="emitter.color" transparent :opacity="emitter.opacity"
            :blending="NormalBlending" :depthWrite="false" />
    </TresPoints>
</template>
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRenderLoop } from '@tresjs/core';
import { BufferGeometry, Float32BufferAttribute, Vector3, TextureLoader, NormalBlending, Color } from 'three';
import { ParsedFlightObject } from '../../../../stores/game';

const { onLoop } = useRenderLoop();

// Props для списка объектов
const props = defineProps<{
    flightObjects: ParsedFlightObject[]
}>();

const testGeometry = new BufferGeometry();
testGeometry.setAttribute('position', new Float32BufferAttribute([0, 100, 0], 3));

const particleSize = 30;
const particleLifetime = 10;
const distanceThreshold = particleSize / 1.5; // Порог для создания новой частицы

// Загрузка текстуры для частиц
const textureLoader = new TextureLoader();
const smokeTexture = ref(null);
onMounted(() => {
    smokeTexture.value = textureLoader.load('/smoke.png');
});

// Массив для хранения эмиттеров
const emitters = ref([]);
const lastPositions = ref(new Map()); // Map для хранения последней позиции по id объекта

function calculateDistance(pos1, pos2) {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const dz = pos1.z - pos2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

// Функция для создания эмиттеров частиц
function createParticlesAt(flightObject: ParsedFlightObject) {
    const geometry = new BufferGeometry();
    const positionsArray = new Float32Array(3); // Для одной частицы
    positionsArray[0] = flightObject.position.x;
    positionsArray[1] = flightObject.position.y;
    positionsArray[2] = flightObject.position.z;
    geometry.setAttribute('position', new Float32BufferAttribute(positionsArray, 3));

    emitters.value.push({
        position: new Vector3(flightObject.position.x, flightObject.position.y, flightObject.position.z),
        map: smokeTexture.value,
        geometry: geometry,
        color: flightObject.isKilled
            ? new Color(0x696969)
            : flightObject.type === 'active-missile'
                ? new Color(0xc0c0c0)
                : new Color(0xffffff),
        opacity: 1.0, // Начальная прозрачность
        startTime: Date.now(),
    });
}

// Слежение за изменениями в списке flightObjects
watch(() => props.flightObjects, (newFlightObjects) => {
    newFlightObjects.forEach((flightObject) => {
        const currentPos = new Vector3(flightObject.position.x, flightObject.position.y, flightObject.position.z);
        const lastPos = lastPositions.value.get(flightObject.id);

        // Если позиции ещё нет или расстояние больше порога, создаём новую частицу
        if (!lastPos || calculateDistance(currentPos, lastPos) > distanceThreshold) {
            createParticlesAt(flightObject);
            lastPositions.value.set(flightObject.id, currentPos); // Обновляем последнюю позицию
        }
    });
});

// Анимация для обновления прозрачности частиц
onLoop(() => {
    const currentTime = Date.now();
    emitters.value.forEach((emitter, index) => {
        const elapsedTime = (currentTime - emitter.startTime) / 1000; // Время жизни в секундах
        const remainingTime = particleLifetime - elapsedTime;

        if (remainingTime > 0) {
            emitter.opacity = remainingTime / particleLifetime; // Плавное исчезновение
        } else {
            emitters.value.splice(index, 1); // Удаляем эмиттер, когда время вышло
        }
    });
});
</script>
