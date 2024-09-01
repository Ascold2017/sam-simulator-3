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

    const position = ref([0, 25, 0])
    const azimuth = ref(0)
    const elevation = ref(0);
   
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
        if (device.isMobile) {
            // Настройка GyroscopeControls для мобильных устройств
            controls = new DeviceOrientationControls(camera, {
                minElevation: -Math.PI/20,
                maxElevation: Math.PI/4
            });
        } else {
            // Настройка FirstPersonControls для десктопов
            controls = new CustomFirstPersonControls(camera, {
                lookSpeed: 0.5,
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

    watch(currentAA, (v) => {
        // TODO
    })
     

    return {
        azimuth,
        elevation,
        createCameraWithControls,
        updateCameraAndControls
    }
})