import { defineStore, storeToRefs } from 'pinia';
import * as THREE from 'three';

import { computed, ref, watch } from 'vue';
import { useMissionStore } from '../mission';
import { addLighting } from './helpers/addLighting';
import { addHeightmapTerrain } from './helpers/addHeightmapTerraing';
import { createFlightObject } from './helpers/addFlightObject';
import { updateFlightObject } from './helpers/updateFlightObject';
import { useCameraStore } from '../camera';
import { createAAObject } from './helpers/addAAObject';

export const useSceneStore = defineStore('scene', () => {
    const missionStore = useMissionStore();
    const { isInitialized, map, aas } = storeToRefs(missionStore)
    const cameraStore = useCameraStore()
    const { camera } = storeToRefs(cameraStore)

    let scene: THREE.Scene | null = null;
    let renderer: THREE.WebGLRenderer | null = null;
    

    const isSceneInitializaed = ref(false);
    const currentFlightObjects = ref<Set<string>>(new Set());

    function initializeScene(containerSelector: string) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            throw new Error(`Container with selector "${containerSelector}" not found.`);
        }

        // Создание сцены
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87CEEB); // Светло-голубой цвет



        // Настройка рендерера
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Создание камеры и контролов
        cameraStore.createCameraWithControls()

        // Добавление освещения
        addLighting(scene);

        isSceneInitializaed.value = true;

        window.addEventListener('resize', onWindowResize);
        animate();
    }

    function animate() {
        requestAnimationFrame(animate);
        updateScene();
    }

    function onWindowResize() {
        if (camera.value && renderer) {
            const container = renderer.domElement.parentElement;
            if (container && camera) {
                camera.value.aspect = container.clientWidth / container.clientHeight;
                camera.value.updateProjectionMatrix();
                renderer.setSize(container.clientWidth, container.clientHeight);
            }
        }
    }

    function updateScene() {
        if (renderer && scene && camera.value) {
            renderer.render(scene, camera.value);
            cameraStore.updateCameraAndControls();
        }
    }

    function updateFlightObjects() {
        const flightObjects = missionStore.flightObjects;
        const existingMeshes = scene?.children.filter((obj) =>
            currentFlightObjects.value.has(obj.name),
        ) || [];

        // Обновление или добавление объектов
        flightObjects.forEach((flightObject) => {
            let mesh = scene?.getObjectByName(flightObject.id) as THREE.Mesh;
            if (!mesh) {
                createFlightObject(scene!, flightObject);
                currentFlightObjects.value.add(flightObject.id);
            } else {
                updateFlightObject(mesh, flightObject)
            }
        });

        // Удаление объектов, которых нет в списке flightObjects
        existingMeshes.forEach((mesh) => {
            const objectExists = flightObjects.some((obj) => obj.id === mesh.name);
            if (!objectExists) {
                scene?.remove(mesh);
                currentFlightObjects.value.delete(mesh.name);
            }
        });
    }


    function $reset() {
        if (renderer) {
            renderer.dispose();
        }
        scene = null;
        renderer = null;
        currentFlightObjects.value.clear();
        isSceneInitializaed.value = false;
        window.removeEventListener('resize', onWindowResize);
    }

    watch([isInitialized, isSceneInitializaed], () => {
        if (isInitialized.value && isSceneInitializaed.value) {
            addHeightmapTerrain(scene!, map.value)
            aas.value.map(aa => createAAObject(scene!, aa))
        }
    })

    watch(computed(() => missionStore.flightObjects), () => {
        scene &&
            updateFlightObjects()
    })

    return {
        initializeScene,
        $reset
    };
});
