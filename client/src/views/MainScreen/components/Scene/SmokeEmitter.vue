<template>
    <!-- Шаблон не изменяется -->
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Position } from '../../../../models/sockets.model';
import { useRenderLoop, useTresContext } from '@tresjs/core';
import { AdditiveBlending, BufferGeometry, Float32BufferAttribute, Points, PointsMaterial, Clock, Vector3 } from 'three';

const { scene } = useTresContext();
const { onLoop } = useRenderLoop();
const clock = new Clock(); // Для анимации

// Props для позиции эмиттера
const props = defineProps<{
    position: Position;
}>();

const particlesPerUpdate = 1;
const particleSize = 30;
const particleLifetime = 30; // Время жизни частиц (в секундах)

// Создаем материал для частиц с поддержкой прозрачности
const particlesMaterial = new PointsMaterial({
    color: 0xaaaaaa,
    size: particleSize,
    transparent: true,
    opacity: 1.0, // Полная непрозрачность в начале
    depthWrite: false,
    blending: AdditiveBlending
});

// Массив для хранения всех эмиттеров
const emitters = ref<Points[]>([]);

// Функция для создания частиц в заданной позиции
function createParticlesAt(position: Position) {
    const particlesGeometry = new BufferGeometry();
    const positions = new Float32Array(particlesPerUpdate * 3); // по 3 координаты на каждую частицу

    // Задаем случайные позиции частиц вокруг точки position
    positions[0] = position.x + (Math.random() - 0.5) * 0.5;
    positions[1] = position.y + (Math.random() - 0.5) * 0.5;
    positions[2] = position.z + (Math.random() - 0.5) * 0.5;

    particlesGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3));

    // Создаем частицы и добавляем их в сцену
    const particles = new Points(particlesGeometry, particlesMaterial.clone());
    particles.userData.startTime = clock.getElapsedTime(); // Запоминаем время создания
    particles.userData.origin = new Vector3(position.x, position.y, position.z);

    emitters.value.push(particles);
    scene.value.add(particles);
}

function calculateDistance(pos1: Position, pos2: Position): number {
    const dx = pos1.x - pos2.x;
    const dy = pos1.y - pos2.y;
    const dz = pos1.z - pos2.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

const previousPosition = ref<Position | null>(null);
// Слежение за изменением позиции, добавляем 3 частицы при каждом изменении
watch(() => props.position, (newPosition) => {
    if (previousPosition.value) {
        const distance = calculateDistance(previousPosition.value, newPosition);
        if (distance > 10) {
            createParticlesAt(newPosition);
            previousPosition.value = { ...newPosition }; // обновляем предыдущую позицию
        }
    } else {
        // Если это первое изменение позиции, создаем частицы
        createParticlesAt(newPosition);
        previousPosition.value = { ...newPosition }; // сохраняем начальную позицию
    }

});

// Анимация вращения частиц вокруг их исходной позиции
function animateParticles() {
    const currentTime = clock.getElapsedTime();

    emitters.value.forEach((particles, index) => {
        const elapsedTime = currentTime - particles.userData.startTime;

        // Уменьшаем прозрачность частиц постепенно в течение 30 секунд
        const remainingTime = particleLifetime - elapsedTime;
        if (remainingTime > 0) {
            particles.material.opacity = remainingTime / particleLifetime; // Плавное исчезновение
        } else {
            // Удаляем частицы из сцены, когда их время вышло
            scene.value.remove(particles);
            emitters.value.splice(index, 1);
        }
    });
}

// Запускаем анимацию на каждом кадре
onLoop(() => animateParticles());
</script>
