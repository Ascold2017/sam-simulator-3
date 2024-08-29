import { defineStore } from 'pinia';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { computed, ref, watch } from 'vue';
import { useMissionStore } from './mission';
import { FlightObjectsUpdateResponse } from '../../../shared/models/mission.model';

export const useSceneStore = defineStore('scene', () => {
    const missionStore = useMissionStore();

    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let renderer: THREE.WebGLRenderer | null = null;
    let controls: OrbitControls | null = null;

    const currentFlightObjects = ref<Set<string>>(new Set());
    const smokeParticles = ref<Map<string, THREE.Points>>(new Map());

    function initializeScene(containerSelector: string) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            throw new Error(`Container with selector "${containerSelector}" not found.`);
        }

        // Создание сцены
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87CEEB); // Светло-голубой цвет

        const gridHelper = new THREE.GridHelper();
        gridHelper.rotateX(Math.PI / 2);
        scene.add(gridHelper);

        // Создание камеры
        camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            10000,
        );
        camera.position.set(0, -500, 300);
        camera.up.set(0, 0, 1);
        camera.lookAt(0, 0, 0);

        // Настройка рендерера
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Настройка OrbitControls
        controls = new OrbitControls(camera, renderer.domElement);
        controls.listenToKeyEvents(window);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 100;
        controls.maxDistance = 1000;
        controls.maxPolarAngle = Math.PI / 2;

        // Добавление освещения
        addLighting();

        animate();
    }

    function updateScene() {
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
            controls?.update();
            updateSmokeTrails();
        }
    }

    // Добавление освещения на сцену
    function addLighting() {
        if (!scene) return;

        const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft white light
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(50, 50, 500).normalize();
        directionalLight.lookAt(0, 0, 0);
        scene.add(directionalLight);

        const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 10);
        scene.add(dirLightHelper);
    }

    function addHeightmapTerrain() {
        if (!scene) return;

        const terrain = missionStore.map;
        if (!terrain) return;
        const mesh = createMeshForTerrain(terrain);
        scene!.add(mesh);
    }

    function createMeshForFlightObject(flightObject: FlightObjectsUpdateResponse[number]): THREE.Mesh {
        let geometry: THREE.BufferGeometry;
        let material: THREE.MeshStandardMaterial;

        switch (flightObject.type) {
            case 'target':
                geometry = new THREE.SphereGeometry(5, 32, 32); // Красный шар для цели
                material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
                break;
            case 'active-missile':
                geometry = new THREE.CylinderGeometry(2, 2, 10, 32); // Зеленый цилиндр для ракеты
                material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
                break;
            case 'bullet':
                geometry = new THREE.SphereGeometry(2, 32, 32); // Желтый шарик для пули
                material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
                break;
            default:
                geometry = new THREE.BoxGeometry(5, 5, 5); // На случай неизвестного типа
                material = new THREE.MeshStandardMaterial({ color: 0xffffff });
                break;
        }
        // Применение позиции
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(
            flightObject.position.x,
            flightObject.position.y,
            flightObject.position.z,
        );
        mesh.name = flightObject.id;
        // Применение вращения
        const velocity = new THREE.Vector3(
            flightObject.velocity.x,
            flightObject.velocity.y,
            flightObject.velocity.z,
        );
        velocity.normalize();

        const axis = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, velocity);
        mesh.quaternion.copy(quaternion);

        addSmokeTrail(flightObject.id, mesh);

        return mesh;
    }

    function createMeshForTerrain(terrain: any): THREE.Mesh {
        const { data, size } = terrain;

        const terrainGeometry = new THREE.PlaneGeometry(
            size * (data.length - 1),
            size * (data[0].length - 1),
            data.length - 1,
            data[0].length - 1,
        );

        const positionAttribute = terrainGeometry.attributes.position;
        for (let i = 0; i < positionAttribute.count; i++) {
            const x = i % data.length;
            const y = Math.floor(i / data.length);
            positionAttribute.setZ(i, data[y][x] / 10);
        }

        positionAttribute.needsUpdate = true;
        terrainGeometry.computeVertexNormals();

        const material = new THREE.MeshStandardMaterial({
            color: 0x0000ff,
            wireframe: false,
        });

        const mesh = new THREE.Mesh(terrainGeometry, material);
        mesh.name = terrain.id;

        return mesh;
    }

    function addSmokeTrail(missileId: string, missileMesh: THREE.Mesh) {
        const particleCount = 100;
        const particlesGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            color: 0x555555,
            size: 10,
            transparent: true,
            opacity: 0.7,
        });

        const smokeTrail = new THREE.Points(particlesGeometry, particlesMaterial);
        smokeTrail.userData = { missileMesh, lastPosition: new THREE.Vector3() };
        scene!.add(smokeTrail);
        smokeParticles.value.set(missileId, smokeTrail);
    }

    function updateSmokeTrails() {
        smokeParticles.value.forEach((smokeTrail) => {
            const { missileMesh, lastPosition } = smokeTrail.userData;
            const positions = smokeTrail.geometry.attributes.position.array;

            lastPosition.copy(missileMesh.position);

            for (let i = positions.length - 3; i > 0; i -= 3) {
                positions[i] = positions[i - 3];
                positions[i + 1] = positions[i - 2];
                positions[i + 2] = positions[i - 1];
            }

            positions[0] = missileMesh.position.x;
            positions[1] = missileMesh.position.y;
            positions[2] = missileMesh.position.z;

            smokeTrail.geometry.attributes.position.needsUpdate = true;
        });
    }

    function updateFlightObjects() {
        const flightObjects = missionStore.flightObjects;
        const existingMeshes = scene!.children.filter((obj) =>
            currentFlightObjects.value.has(obj.name),
        );

        // Обновление или добавление объектов
        flightObjects.forEach((flightObject) => {
            let mesh = scene!.getObjectByName(flightObject.id);
            if (!mesh) {
                mesh = createMeshForFlightObject(flightObject);
                scene!.add(mesh);
                currentFlightObjects.value.add(flightObject.id);
            } else {
                mesh.position.set(
                    flightObject.position.x,
                    flightObject.position.y,
                    flightObject.position.z,
                );
                const velocity = new THREE.Vector3(
                    flightObject.velocity.x,
                    flightObject.velocity.y,
                    flightObject.velocity.z,
                );
                velocity.normalize();
                const axis = new THREE.Vector3(0, 1, 0);
                const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, velocity);
                mesh.quaternion.copy(quaternion);
            }
        });

        // Удаление объектов, которых нет в списке flightObjects
        existingMeshes.forEach((mesh) => {
            const objectExists = flightObjects.some((obj) => obj.id === mesh.name);
            if (!objectExists) {
                scene!.remove(mesh);
                currentFlightObjects.value.delete(mesh.name);
            }
        });
    }

    function animate() {
        requestAnimationFrame(animate);
        updateScene();
    }

    function $reset() {
        if (renderer) {
            renderer.dispose();
        }
        scene = null;
        camera = null;
        renderer = null;
        controls = null;
        currentFlightObjects.value.clear();
        smokeParticles.value.clear();
    }

    watch(computed(() => missionStore.map), (v) => {
        addHeightmapTerrain()
    })

    return {
        initializeScene,
        addHeightmapTerrain,
        updateFlightObjects,
        $reset
    };
});
