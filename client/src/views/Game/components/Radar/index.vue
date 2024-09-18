<template>
    <v-stage :config="{ width: 210, height: 210 }">
        <v-layer>
            <v-text :config="{
                x: 175,
                y: 0,
                text: '8 km',
                fill: 'rgb(21, 128, 61)',
                fontFamily: 'DS-Digital, sans-serif',
                fontSize: 16
            }"></v-text>
            <!-- Радиальные круги (разметка по радиусу) -->
            <v-circle v-for="radius in radii" :key="radius"
                :config="{ x: 105, y: 105, radius, stroke: 'rgba(0, 255, 0, 1)', strokeWidth: 0.5 }" />

            <!-- Азимутальная разметка (линии под углом) -->
            <v-line v-for="angle in angles" :key="angle" :config="{
                points: [105, 105, 105 + radius * Math.cos(angle), 105 + radius * Math.sin(angle)],
                stroke: 'rgba(0, 255, 0, 1)',
                strokeWidth: 0.5
            }" />

            <v-circle :config="{
                x: 105,
                y: 105,
                radius,
                stroke: 'rgb(21, 128, 61)',
                fill: 'rgba(21, 128, 61, 0.6)',
            }"></v-circle>

            <!-- Указатель текущего азимута -->
            <v-wedge :config="{
                x: 105,
                y: 105,
                radius,
                angle: captureAngle,
                rotation: azimuth - captureAngle / 2,  // Начало сектора на -1.5 градуса от азимута
                fill: 'rgba(255, 0, 0, 0.5)',
                stroke: 'rgb(255, 0, 0)',
                strokeWidth: 1
            }" />
        </v-layer>
        <v-layer>
            <!-- Отображение объектов -->
            <v-circle v-for="(object, index) in flightObjectsOnRadar" :key="index" :config="{
                ...object,
                radius: 3,
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
import { computed } from 'vue';
import { useGameStore } from '../../../../stores/game';

const gameStore = useGameStore()

const azimuth = computed(() => -gameStore.direction.azimuth * (180 / Math.PI))
const captureAngle = computed(() => (gameStore.currentAA?.captureAngle || 0) * (180 / Math.PI))
const flightObjects = computed(() => gameStore.parsedFlightObjects || [])
const aaObjects = computed(() => gameStore.aas || [])
const radarPosition = computed(() => gameStore.currentAA?.position || { x: 0, y: 0, z: 0 });

const radius = 100;
const maxRadarDistance = 8000;
// Массив радиальных шагов (1 км = 50px)
const radii = [25, 50, 75, 100];

// Массив углов для азимутальной разметки (шаг 10 градусов)
const angles = Array.from({ length: 36 }, (_, i) => (i * 10 * Math.PI) / 180);

// Рассчет позиции объектов относительно радара
const flightObjectsOnRadar = computed(() => {
    return flightObjects.value.map(obj => {
        const dx = obj.position.x - radarPosition.value.x;
        const dz = obj.position.z - radarPosition.value.z; // z-координата используется для положения на плоскости
        const distance = Math.sqrt(dx * dx + dz * dz); // Евклидово расстояние до объекта
        const angle = Math.atan2(dx, dz); // Угол до объекта
        const normalizedDistance = (distance / maxRadarDistance) * radius; // Масштабирование дистанции

        return {
            x: 105 + normalizedDistance * Math.cos(-angle - Math.PI), // перевод в пиксели
            y: 105 + normalizedDistance * Math.sin(-angle - Math.PI),
            fill: obj.isCaptured ? 'red' : 'yellow'
        };
    });
});

const aaObjectsOnRadar = computed(() => {
    return aaObjects.value.map(obj => {
        const dx = obj.position.x - radarPosition.value.x;
        const dz = obj.position.z - radarPosition.value.z; // z-координата используется для положения на плоскости
        const distance = Math.sqrt(dx * dx + dz * dz); // Евклидово расстояние до объекта

        const angle = Math.atan2(dx, dz); // Угол до объекта
        const normalizedDistance = (distance / maxRadarDistance) * radius; // Масштабирование дистанции

        return {
            x: 105 + normalizedDistance * Math.cos(-angle - Math.PI), // перевод в пиксели
            y: 105 + normalizedDistance * Math.sin(-angle - Math.PI),
        }
    });
})
</script>