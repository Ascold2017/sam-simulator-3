import { defineStore, storeToRefs } from 'pinia';
import * as THREE from 'three';
import { FirstPersonControls } from 'three/addons/controls/FirstPersonControls.js';
import { computed, ref, watch } from 'vue';
import { useMissionStore } from './mission';
import { FlightObjectsUpdateResponse } from '../../../shared/models/mission.model';

export const useSceneStore = defineStore('scene', () => {
    const missionStore = useMissionStore();
    const { isInitialized, map } = storeToRefs(missionStore)

    let scene: THREE.Scene | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let renderer: THREE.WebGLRenderer | null = null;
    let controls: FirstPersonControls | null = null;
    const clock = new THREE.Clock();

    const isSceneInitializaed = ref(false);
    const currentFlightObjects = ref<Set<string>>(new Set());
    const smokeParticles = new Map<string, THREE.Points>();

    function initializeScene(containerSelector: string) {
        const container = document.querySelector(containerSelector);
        if (!container) {
            throw new Error(`Container with selector "${containerSelector}" not found.`);
        }

        // Создание сцены
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x87CEEB); // Светло-голубой цвет

        // Создание камеры
        camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            10000,
        );
        camera.position.set(0, 25, 0);
        camera.lookAt(1, 25, 0);
        camera.layers.enableAll()
        // Настройка рендерера
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Настройка OrbitControls
        controls = new FirstPersonControls(camera, renderer.domElement);
        // Установка оси вращения
        controls.lookVertical = true; // Включаем вертикальный взгляд
        controls.verticalMin = Math.PI / 6;
        controls.verticalMax = Math.PI / 2
        controls.constrainVertical = true; // Ограничиваем вертикальное вращение
        controls.movementSpeed = 0;
        controls.lookSpeed = 0.2;

        // Добавление освещения
        addLighting();

        isSceneInitializaed.value = true;
        animate();
    }

    function updateScene() {
        if (renderer && scene && camera) {
            renderer.render(scene, camera);
            controls?.update(clock.getDelta());
            updateSmokeTrails();

        }
    }

    // Добавление освещения на сцену
    function addLighting() {
        if (!scene) return;

        const ambientLight = new THREE.AmbientLight(0x404040, 1); // Soft white light
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(50, 500, 50).normalize();
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
        const width = (data.length - 1) * size;
        const height = (data[0].length - 1) * size;
        const terrainGeometry = new THREE.PlaneGeometry(
            width * size, // ширина плоскости
            height * size, // высота плоскости
            data.length - 1, data[0].length - 1
        );

        // Модифицируем вершины геометрии на основе матрицы высот
        for (let i = 0; i < data.length; i++) {
            for (let j = 0; j < data[i].length; j++) {
                const vertexIndex = i * data[i].length + j;
                const heightValue = data[i][j];

                // Устанавливаем высоту (Z) для каждой вершины
                terrainGeometry.attributes.position.setZ(vertexIndex, heightValue);
                // Устанавливаем позиции X и Y с учетом elementSize
                const x = (j - (data[i].length - 1) / 2) * size;
                const y = (i - (data.length - 1) / 2) * size;
                terrainGeometry.attributes.position.setX(vertexIndex, x);
                terrainGeometry.attributes.position.setY(vertexIndex, y);
            }
        }

        terrainGeometry.attributes.position.needsUpdate = true;
        terrainGeometry.computeVertexNormals();


        const material = new THREE.MeshStandardMaterial({
            color: 0x0000ff,
            wireframe: false,
            side: THREE.BackSide
        });

        const mesh = new THREE.Mesh(terrainGeometry, material);
        mesh.rotation.x = -Math.PI / 2;
        mesh.name = terrain.id;

        return mesh;
    }

    function addSmokeTrail(entityId: string, entityMesh: THREE.Mesh) {
        const particleCount = 100;
        const particlesGeometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = entityMesh.position.x + i * 0.1; // Убедитесь, что частицы не все в одной точке
            positions[i * 3 + 1] = entityMesh.position.y;
            positions[i * 3 + 2] = entityMesh.position.z;
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            color: 0x555555,
            size: 20, // Увеличенный размер частиц
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending // Аддитивное смешивание для лучшей видимости
        });

        const smokeTrail = new THREE.Points(particlesGeometry, particlesMaterial);
        smokeTrail.userData = { entityMesh, lastPosition: new THREE.Vector3() };
        scene?.add(smokeTrail)
        smokeParticles.set(entityId, smokeTrail);
    }

    function updateSmokeTrails() {
        smokeParticles.forEach((smokeTrail) => {
            const { entityMesh, lastPosition } = smokeTrail.userData;
            const positions = smokeTrail.geometry.attributes.position.array;
            lastPosition.copy(entityMesh.position);

            for (let i = positions.length - 3; i > 0; i -= 3) {
                positions[i] = positions[i - 3];
                positions[i + 1] = positions[i - 2];
                positions[i + 2] = positions[i - 1];
            }

            positions[0] = entityMesh.position.x;
            positions[1] = entityMesh.position.y;
            positions[2] = entityMesh.position.z;

            smokeTrail.geometry.attributes.position.needsUpdate = true;
        });
    }

    function updateFlightObjects() {
        const flightObjects = missionStore.flightObjects;
        const existingMeshes = scene?.children.filter((obj) =>
            currentFlightObjects.value.has(obj.name),
        ) || [];

        // Обновление или добавление объектов
        flightObjects.forEach((flightObject) => {
            let mesh = scene?.getObjectByName(flightObject.id);
            if (!mesh) {
                mesh = createMeshForFlightObject(flightObject);
                scene?.add(mesh);
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
                scene?.remove(mesh);
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
        smokeParticles.clear();
        isSceneInitializaed.value = false;
    }

    watch([isInitialized, map, isSceneInitializaed], () => {
        if (isInitialized.value && isSceneInitializaed.value) {
            addHeightmapTerrain()
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
