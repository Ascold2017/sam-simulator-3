<template>
    <v-stage :config="{ width: 240, height: 240 }">
        <v-layer>
            <v-text :config="{
                x: 190,
                y: 0,
                text: '8 km',
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
                rotation: azimuth - captureAngle / 2,  // Начало сектора на -1.5 градуса от азимута
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
import { computed } from 'vue';
import { useGameStore } from '../../../../stores/game';
import { storeToRefs } from 'pinia';

const gameStore = useGameStore()
const { currentAA, parsedTargetNPCs, missiles, aas } = storeToRefs(gameStore);

const azimuth = computed(() => -gameStore.direction.azimuth * (180 / Math.PI))
const captureAngle = computed(() => 0.06)

const radius = 115;
const maxRadarDistance = 8000;
// Массив радиальных шагов (1 км = 50px)
const radii = [28.25, 57.5, 83.75, 115];

// Массив углов для азимутальной разметки (шаг 10 градусов)
const angles = Array.from({ length: 36 }, (_, i) => (i * 10 * Math.PI) / 180);

const targetsOnRadar = computed(() => {
    return parsedTargetNPCs.value.filter(t => currentAA.value.detectedTargetIds.includes(t.id) && !t.isDestroyed).map(obj => {
        const dx = obj.position[0] - currentAA.value.position[0];
        const dz = obj.position[2] - currentAA.value.position[2]; // z-координата используется для положения на плоскости
        const distance = Math.sqrt(dx * dx + dz * dz); // Евклидово расстояние до объекта
        const angle = Math.atan2(dx, dz); // Угол до объекта
        const normalizedDistance = (distance / maxRadarDistance) * radius; // Масштабирование дистанции

        return {
            x: 120 + normalizedDistance * Math.cos(-angle - Math.PI), // перевод в пиксели
            y: 120 + normalizedDistance * Math.sin(-angle - Math.PI),
            fill: obj.isCaptured ? 'red' : 'yellow'
        };
    })
});

const missilesOnRadar = computed(() => {
    return missiles.value.filter(m => !m.isDestroyed).map(obj => {
        const dx = obj.position[0] - currentAA.value.position[0];
        const dz = obj.position[2] - currentAA.value.position[2]; // z-координата используется для положения на плоскости
        const distance = Math.sqrt(dx * dx + dz * dz); // Евклидово расстояние до объекта
        const angle = Math.atan2(dx, dz); // Угол до объекта
        const normalizedDistance = (distance / maxRadarDistance) * radius; // Масштабирование дистанции

        return {
            x: 120 + normalizedDistance * Math.cos(-angle - Math.PI), // перевод в пиксели
            y: 120 + normalizedDistance * Math.sin(-angle - Math.PI),
            fill: currentAA.value.launchedMissileIds.includes(obj.id) ? 'red' : 'yellow'
        };
    })
});

const aaObjectsOnRadar = computed(() => {
    return aas.value.map(obj => {
        const dx = obj.position[0] - currentAA.value.position[0];
        const dz = obj.position[2] - currentAA.value.position[2];
        const distance = Math.sqrt(dx * dx + dz * dz); // Евклидово расстояние до объекта

        const angle = Math.atan2(dx, dz); // Угол до объекта
        const normalizedDistance = (distance / maxRadarDistance) * radius; // Масштабирование дистанции

        return {
            x: 120 + normalizedDistance * Math.cos(-angle - Math.PI), // перевод в пиксели
            y: 120 + normalizedDistance * Math.sin(-angle - Math.PI),
        }
    });
})
</script>