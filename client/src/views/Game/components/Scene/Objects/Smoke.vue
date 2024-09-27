<template>
    <TresPoints v-for="(emitter, index) in emitters" :key="index" :geometry="emitter.geometry">
        <TresPointsMaterial :map="emitter.map" :size="particleSize" :color="emitter.color" transparent
            :opacity="emitter.opacity" :blending="NormalBlending" :depthWrite="false" />
    </TresPoints>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRenderLoop } from '@tresjs/core';
import { BufferGeometry, Float32BufferAttribute, Vector3, TextureLoader, NormalBlending, Color } from 'three';

const props = defineProps<{
    color: number,
    position: [number, number, number],
    particleSize: number
    enabled: boolean;
}>();

const particleLifetime = 5;
const distanceThreshold = computed(() => props.particleSize / 1.5); // Порог для создания новой частицы

const { onLoop } = useRenderLoop();

const textureLoader = new TextureLoader();
const smokeTexture = ref(null);
onMounted(() => {
    smokeTexture.value = textureLoader.load('/smoke.png');
});


const emitters = ref([]);
const lastPositions = ref<Vector3 | null>(null);

// Базовая геометрия для частиц
const baseGeometry = new BufferGeometry();
const basePositionsArray = new Float32Array(3); // Для одной частицы
baseGeometry.setAttribute('position', new Float32BufferAttribute(basePositionsArray, 3));


function createParticlesAt() {
    const geometry = baseGeometry.clone();
    const positionsArray = new Float32Array(3); // Для одной частицы
    positionsArray[0] = props.position[0]
    positionsArray[1] = props.position[1];
    positionsArray[2] = props.position[2];
    geometry.setAttribute('position', new Float32BufferAttribute(positionsArray, 3));

    emitters.value.push({
        position: new Vector3(...props.position),
        map: smokeTexture.value,
        geometry: geometry,
        color: new Color(props.color),
        opacity: 1.0, // Начальная прозрачность
        startTime: Date.now(),
    });
}

watch(() => props.position, (newPosition) => {

    const currentPos = new Vector3(...newPosition);
    const lastPos = lastPositions.value;

    // Если позиции ещё нет или расстояние больше порога, создаём новую частицу
    if (!lastPos || currentPos.distanceTo(lastPos) > distanceThreshold.value) {
        props.enabled && createParticlesAt();
        lastPositions.value = currentPos; // Обновляем последнюю позицию
    }
})

onLoop(() => {
    const currentTime = Date.now();
    const expiredEmitters = [];

    emitters.value.forEach((emitter, index) => {
        const elapsedTime = (currentTime - emitter.startTime) / 1000; // Время жизни в секундах
        const remainingTime = particleLifetime - elapsedTime;
        if (remainingTime > 0) {
            emitter.opacity = remainingTime / particleLifetime; // Плавное исчезновение
        } else {
            expiredEmitters.push(index);
        }
    });

    expiredEmitters.forEach((index) => emitters.value.splice(index, 1));
});

</script>