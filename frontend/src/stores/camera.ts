import { defineStore } from "pinia";
import * as THREE from 'three'
import { FirstPersonControls } from "three/examples/jsm/Addons.js";
import { DeviceOrientationControls } from "../helpers/DeviceOrientationControls";
import { isMobileDevice } from "../helpers/isMobile";
import { ref } from "vue";

export const useCameraStore = defineStore('camera', () => {
    const azimuth = ref(0)
    const elevation = ref(0);
    const orientation = ref<'landscape' | 'portrait'>('landscape')
    let controls: DeviceOrientationControls | FirstPersonControls;
    const clock = new THREE.Clock();

    function createCameraWithControls(domElement: HTMLElement) {
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            10000,
        );
        camera.position.set(0, 25, 0);
        camera.lookAt(1, 25, 0);
        camera.layers.enableAll()
        // Определяем тип устройстваL
        if (isMobileDevice()) {
            // Настройка GyroscopeControls для мобильных устройств
            controls = new DeviceOrientationControls(camera);
        } else {
            // Настройка FirstPersonControls для десктопов
            controls = new FirstPersonControls(camera, domElement);
            controls.lookVertical = true; // Включаем вертикальный взгляд
            controls.verticalMin = Math.PI / 6;
            controls.verticalMax = Math.PI / 2;
            controls.constrainVertical = true; // Ограничиваем вертикальное вращение
            controls.movementSpeed = 0;
            controls.lookSpeed = 0.2;
        }
        return camera
    }

    function updateCameraAndControls(camera: THREE.PerspectiveCamera) {
        console.log(camera)
        azimuth.value = camera.rotation.y;
        elevation.value = camera.rotation.x
        controls.update(clock.getDelta());
    }

    return {
        azimuth,
        elevation,
        orientation,
        createCameraWithControls,
        updateCameraAndControls
    }
})