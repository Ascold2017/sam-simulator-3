<template>
    <!-- Компонент не рендерит ничего напрямую -->
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useTres, useLoop } from '@tresjs/core';
import * as THREE from 'three';

const props = withDefaults(defineProps<{
    minElevation: number;
    maxElevation: number;
}>(), {
    minElevation: 0,
    maxElevation: Math.PI
})

const emit = defineEmits<{
    updateDirection: [direction: { azimuth: number; elevation: number }],
    updateOrientation: [orientation: 'portrait' | 'landscape']
}>()


const deviceOrientation = ref<DeviceOrientationEvent | {}>({});
const screenOrientation = ref<number>(0);
const alpha = ref(0);
const alphaOffsetAngle = ref(0);
const betaOffsetAngle = ref(0);
const gammaOffsetAngle = ref(0);

const { camera } = useTres(); // Используем камеру из TresJS
const { render } = useLoop()

// Функция для обновления ориентации устройства
const onDeviceOrientationChangeEvent = (event: DeviceOrientationEvent) => {
    deviceOrientation.value = event;
};

// Функция для изменения ориентации экрана
const onScreenOrientationChangeEvent = () => {
    screenOrientation.value = window.orientation || 0;

    // Определение ориентации экрана и отправка события
    const orientation = screenOrientation.value === 0 ? 'portrait' : 'landscape';
    emit('updateOrientation', orientation);
};

// Функция для нормализации углов возвышения
const applyElevationConstraints = (quaternion: THREE.Quaternion) => {
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(quaternion);

    const elevation = Math.asin(forward.y);
    if (elevation < props.minElevation || elevation > props.maxElevation) {
        const constrainedElevation = Math.max(props.minElevation, Math.min(props.maxElevation, elevation));
        const deltaElevation = constrainedElevation - elevation;
        const qElevation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), deltaElevation);
        quaternion.multiply(qElevation);
    }


};

// Функция для установки кватерниона объекта на основе данных устройства
const setObjectQuaternion = (() => {
    const zee = new THREE.Vector3(0, 0, 1);
    const euler = new THREE.Euler();
    const q0 = new THREE.Quaternion();
    const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

    return (quaternion: THREE.Quaternion, alpha: number, beta: number, gamma: number, orient: number) => {
        euler.set(beta, alpha, -gamma, 'YXZ');
        quaternion.setFromEuler(euler);

        quaternion.multiply(q1); // Корректировка ориентации камеры относительно устройства
        quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // Корректировка по ориентации экрана

        applyElevationConstraints(quaternion);
    };
})();

// Функция вычисления азимута и угла возвышения
const getAzimuthAndElevation = (quaternion: THREE.Quaternion) => {
    const direction = new THREE.Vector3(0, 0, -1); // Вектор направления "вперед"
    direction.applyQuaternion(quaternion); // Применение кватерниона для вращения направления

    const azimuth = Math.atan2(direction.x, direction.z) + Math.PI; // Азимут - угол в горизонтальной плоскости
    const elevation = Math.asin(direction.y); // Угол возвышения - по оси Y

    return { azimuth, elevation };
};

// Функция обновления ориентации камеры
const updateOrientation = () => {
    const event = deviceOrientation.value as DeviceOrientationEvent;

    const alphaValue = event.alpha ? THREE.MathUtils.degToRad(event.alpha) + alphaOffsetAngle.value : 0;
    const betaValue = event.beta ? THREE.MathUtils.degToRad(event.beta) + betaOffsetAngle.value : 0;
    const gammaValue = event.gamma ? THREE.MathUtils.degToRad(event.gamma) + gammaOffsetAngle.value : 0;
    const orient = screenOrientation.value ? THREE.MathUtils.degToRad(screenOrientation.value) : 0;

    setObjectQuaternion(camera.value!.quaternion, alphaValue, betaValue, gammaValue, orient);
    alpha.value = alphaValue;

    // Получаем текущие значения азимута и угла возвышения
    const { azimuth, elevation } = getAzimuthAndElevation(camera.value!.quaternion);
    emit('updateDirection', { azimuth, elevation }); // Отправляем событие с актуальными значениями
};

// Подключение обработчиков событий
const connect = () => {
    window.addEventListener('orientationchange', onScreenOrientationChangeEvent, false);
    window.addEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
    onScreenOrientationChangeEvent();
};

// Отключение обработчиков событий
const disconnect = () => {
    window.removeEventListener('orientationchange', onScreenOrientationChangeEvent, false);
    window.removeEventListener('deviceorientation', onDeviceOrientationChangeEvent, false);
};

// Монтирование компонента
onMounted(() => {
    connect();

    render(({ renderer, scene, camera }) => {
        updateOrientation();
        renderer.render(scene, camera)
    })
});

// Очистка при размонтировании компонента
onUnmounted(() => {
    disconnect();
});
</script>

<style scoped>
/* Стилей не требуется, так как компонент управляет камерой */
</style>