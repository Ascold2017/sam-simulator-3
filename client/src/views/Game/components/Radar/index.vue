<template>
    <v-stage :config="{ width: 240, height: 240 }">
        <v-layer>
            <v-text :config="{
                x: 190,
                y: 0,
                text: displayedRange  + ' m',
                fill: 'rgb(21, 128, 61)',
                fontFamily: 'DS-Digital, sans-serif',
                fontSize: 16,
                fontWeight: 'bold'
            }"></v-text>
            <!-- Радиальные круги (разметка по радиусу) -->
            <v-circle v-for="radius in radii" :key="radius"
                :config="{ x: 120, y: 120, radius, stroke: 'rgba(0, 255, 0, 1)', strokeWidth: 0.5 }" />

            <!-- Азимутальная разметка (линии под углом) -->
            <v-line v-for="angle in angles" :key="angle" :config="{
                points: [120, 120, 120 + radius * Math.cos(angle), 120 + radius * Math.sin(angle)],
                stroke: 'rgba(0, 255, 0, 1)',
                strokeWidth: 0.5
            }" />

            <v-circle :config="{
                x: 120,
                y: 120,
                radius,
                stroke: 'rgb(21, 128, 61)',
                fill: 'rgba(21, 128, 61, 0.6)',
            }"></v-circle>

            <!-- Указатель текущего азимута -->
            <v-wedge :config="{
                x: 120,
                y: 120,
                radius,
                angle: captureAngle,
                rotation: azimuth - captureAngle / 2,
                fill: 'rgba(255, 0, 0, 0.5)',
                stroke: 'rgb(255, 0, 0)',
                strokeWidth: 1
            }" />
        </v-layer>
        <v-layer>
            <!-- Отображение объектов -->
            <v-circle v-for="(object, index) in targetsOnRadar" :key="index" :config="{
                ...object,
                radius: 3,
            }"></v-circle>

            <v-circle v-for="(object, index) in missilesOnRadar" :key="index" :config="{
                ...object,
                radius: 1,
            }"></v-circle>

            <v-rect v-for="(object, index) in aaObjectsOnRadar" :key="index" :config="{
                ...object,
                width: 2,
                height: 2,
                fill: 'orange'
            }"></v-rect>
        </v-layer>
    </v-stage>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useGameStore } from '../../../../stores/game';
import { storeToRefs } from 'pinia';

const gameStore = useGameStore();
const { currentAA, parsedTargetNPCs, missiles, aas } = storeToRefs(gameStore);

const azimuth = computed(() => -gameStore.direction.azimuth * (180 / Math.PI));
const captureAngle = computed(() => gameStore.currentAA?.captureAngle || 0);
const maxRange = computed(() => gameStore.currentAA?.maxRange || 0);

// Радиус для отображения на экране (размер дисплея радара)
const radius = 115;

// Текущее состояние масштаба (показ полной или половинной дальности)
const isHalfScale = ref(false);

// Отображаемая дальность радара на основе текущего масштаба
const displayedRange = computed(() => (isHalfScale.value ? maxRange.value / 2 : maxRange.value));

// Функция для переключения масштаба радара
const toggleScale = () => {
    isHalfScale.value = !isHalfScale.value;
};

// Массив радиальных шагов (1 км = 50px)
const radii = computed(() => {
    return [28.25, 57.5, 83.75, 115];
});

// Массив углов для азимутальной разметки (шаг 10 градусов)
const angles = Array.from({ length: 36 }, (_, i) => (i * 10 * Math.PI) / 180);

// Вычисление объектов на радаре в зависимости от текущего масштаба
const targetsOnRadar = computed(() => {
    if (!currentAA.value) return [];
    return parsedTargetNPCs.value.filter(t => currentAA.value.detectedTargetIds.includes(t.id) && !t.isDestroyed).map(obj => {
        const dx = obj.position[0] - currentAA.value.position[0];
        const dz = obj.position[2] - currentAA.value.position[2];
        const distance = Math.sqrt(dx * dx + dz * dz);
        const angle = Math.atan2(dx, dz);

        const normalizedDistance = (distance / displayedRange.value) * radius;
        return {
            x: 120 + normalizedDistance * Math.cos(-angle - Math.PI),
            y: 120 + normalizedDistance * Math.sin(-angle - Math.PI),
            fill: obj.isCaptured ? 'red' : 'yellow',
        };
    });
});

// То же для ракет и других объектов
const missilesOnRadar = computed(() => {
    if (!currentAA.value) return [];
    return missiles.value.filter(m => !m.isDestroyed).map(obj => {
        const dx = obj.position[0] - currentAA.value.position[0];
        const dz = obj.position[2] - currentAA.value.position[2];
        const distance = Math.sqrt(dx * dx + dz * dz);
        const angle = Math.atan2(dx, dz);

        const normalizedDistance = (distance / displayedRange.value) * radius;
        return {
            x: 120 + normalizedDistance * Math.cos(-angle - Math.PI),
            y: 120 + normalizedDistance * Math.sin(-angle - Math.PI),
            fill: currentAA.value.launchedMissileIds.includes(obj.id) ? 'red' : 'yellow',
        };
    });
});

const aaObjectsOnRadar = computed(() => {
    if (!currentAA.value) return [];
    return aas.value.map(obj => {
        const dx = obj.position[0] - currentAA.value.position[0];
        const dz = obj.position[2] - currentAA.value.position[2];
        const distance = Math.sqrt(dx * dx + dz * dz);
        const angle = Math.atan2(dx, dz);

        const normalizedDistance = (distance / displayedRange.value) * radius;
        return {
            x: 120 + normalizedDistance * Math.cos(-angle - Math.PI),
            y: 120 + normalizedDistance * Math.sin(-angle - Math.PI),
        };
    });
});

defineExpose({ toggleScale });
</script>
