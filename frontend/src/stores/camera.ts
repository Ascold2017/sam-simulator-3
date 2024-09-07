import { defineStore, storeToRefs } from "pinia";
import * as THREE from 'three'
import { DeviceOrientationControls } from "../helpers/DeviceOrientationControls";
import { ref, watch } from "vue";
import { CustomFirstPersonControls } from "../helpers/CustomFirstPersonControls";
import { useDevice } from "./device";
import { useMissionStore } from "./mission";

export const useCameraStore = defineStore('camera', () => {
    const device = useDevice()
    const mission = useMissionStore();
    const { currentAA } = storeToRefs(mission)

    const camera = ref<THREE.PerspectiveCamera | null>(null);
    const azimuth = ref(0)
    const elevation = ref(0);

    let controls: DeviceOrientationControls | CustomFirstPersonControls;

    function createCameraWithControls() {
        camera.value = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            10000,
        );
        camera.value.layers.enableAll()
        // Определяем тип устройстваL
        if (device.isMobile) {
            // Настройка GyroscopeControls для мобильных устройств
            controls = new DeviceOrientationControls(camera.value, {
                minElevation: -Math.PI / 20,
                maxElevation: Math.PI / 4
            });
        } else {
            // Настройка FirstPersonControls для десктопов
            controls = new CustomFirstPersonControls(camera.value, {
                lookSpeed: 0.5,
                minElevation: -Math.PI / 20,
                maxElevation: Math.PI / 4
            });
        }
    }

    function updateCameraAndControls() {
        function normalizeAngle(angle: number): number {
            return angle < 0 ? angle + 2 * Math.PI : angle;
        }
        azimuth.value = normalizeAngle(camera.value!.rotation.y);
        elevation.value = camera.value!.rotation.x
        controls.update();
    }

    watch([currentAA, camera], (v) => {
        if (currentAA.value && camera.value) {
            const aa = currentAA.value
            camera.value?.position.set(aa.position.x, aa.position.y, aa.position.z)
            camera.value.lookAt(aa.position.x + 1, aa.position.y, aa.position.z);
        }
    })

    return {
        azimuth,
        elevation,
        camera,
        createCameraWithControls,
        updateCameraAndControls
    }
})