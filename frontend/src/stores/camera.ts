import { defineStore } from "pinia";
import * as THREE from 'three'
import { DeviceOrientationControls } from "../helpers/DeviceOrientationControls";
import { isMobileDevice } from "../helpers/isMobile";
import { onMounted, onUnmounted, ref } from "vue";
import { CustomFirstPersonControls } from "../helpers/CustomFirstPersonControls";

export const useCameraStore = defineStore('camera', () => {
    const position = ref([0, 25, 0])
    const azimuth = ref(0)
    const elevation = ref(0);
    const orientation = ref<'landscape' | 'portrait'>('landscape')
    let controls: DeviceOrientationControls | CustomFirstPersonControls;

    function createCameraWithControls() {
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            10000,
        );
        camera.position.set(position.value[0], position.value[1], position.value[2]);
        camera.lookAt(position.value[0] + 1, position.value[1], position.value[2]);
        camera.layers.enableAll()
        // Определяем тип устройстваL
        if (isMobileDevice()) {
            // Настройка GyroscopeControls для мобильных устройств
            controls = new DeviceOrientationControls(camera, {
                minElevation: -Math.PI/20,
                maxElevation: Math.PI/4
            });
        } else {
            // Настройка FirstPersonControls для десктопов
            controls = new CustomFirstPersonControls(camera, {
                lookSpeed: 0.2,
                minElevation: -Math.PI/20,
                maxElevation: Math.PI/4
            });
        }
        return camera
    }

    function updateCameraAndControls(camera: THREE.PerspectiveCamera) {
        function normalizeAngle(angle: number): number {
            return angle < 0 ? angle + 2 * Math.PI : angle;
        }
        azimuth.value = normalizeAngle(camera.rotation.y);
        elevation.value = camera.rotation.x
        controls.update();
    }

    function handleOrientationChange() {
        if (window.orientation === 0 || window.orientation === 180) {
            orientation.value = 'portrait';
        } else {
            orientation.value = 'landscape';
        }
    }

     // Следим за изменением ориентации экрана
     onMounted(() => {
        window.addEventListener('orientationchange', handleOrientationChange);
        // Инициализируем начальную ориентацию
        handleOrientationChange();
    });

    onUnmounted(() => {
        window.removeEventListener('orientationchange', handleOrientationChange);
    });

    return {
        azimuth,
        elevation,
        orientation,
        createCameraWithControls,
        updateCameraAndControls
    }
})