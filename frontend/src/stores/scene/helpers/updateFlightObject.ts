import * as THREE from 'three'
import { ParsedFlightObject } from '../../mission';

export function updateFlightObject(entityMesh: THREE.Mesh, update: ParsedFlightObject, camera: THREE.Camera) {
    entityMesh.position.set(
        update.position.x,
        update.position.y,
        update.position.z,
    );
    const velocity = new THREE.Vector3(
        update.velocity.x,
        update.velocity.y,
        update.velocity.z,
    );
    velocity.normalize();
    const axis = new THREE.Vector3(0, 1, 0);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(axis, velocity);
    entityMesh.quaternion.copy(quaternion);

    updateSmokeTrail(entityMesh.userData.smokeTrail)
    if (update.isCaptured) {
        if (!entityMesh.userData.isCaptured) {
            addCanvasOutline(entityMesh, camera);
            entityMesh.userData.isCaptured = true;
        }
    } else {
        
        if (entityMesh.userData.isCaptured) {
            removeCanvasOutline(entityMesh);
            entityMesh.userData.isCaptured = false;
        }
    }

    // Обновляем рамку, если она есть
    if (entityMesh.userData.outline) {
        updateOutlineScale(entityMesh.userData.outline, entityMesh, camera);
    }
}

function updateSmokeTrail(smokeTrail: THREE.Points) {
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
}

function addCanvasOutline(entityMesh: THREE.Mesh, camera: THREE.Camera) {
    // Создаем текстуру из канваса
    const canvasTexture = createOutlineTexture();
    const planeMaterial = new THREE.MeshBasicMaterial({
        map: canvasTexture,
        transparent: true
    });

    // Создаем плоскость для рамки
    const planeGeometry = new THREE.PlaneGeometry(1, 1); // Плоскость будет масштабироваться позже
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);

    // Добавляем плоскость как дочерний элемент entityMesh
    entityMesh.add(planeMesh);

    // Сохраняем ссылку на плоскость
    entityMesh.userData.outline = planeMesh;
}

function removeCanvasOutline(entityMesh: THREE.Mesh) {
    // Удаляем рамку, если она существует
    const outline = entityMesh.userData.outline;
    if (outline) {
        entityMesh.remove(outline);
        entityMesh.userData.outline = null;
    }
}

function createOutlineTexture(): THREE.Texture {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d')!;

    // Рисуем красную рамку
    context.strokeStyle = 'red';
    context.lineWidth = 10;
    context.strokeRect(0, 0, size, size);

    return new THREE.CanvasTexture(canvas);
}

function updateOutlineScale(planeMesh: THREE.Mesh, entityMesh: THREE.Mesh, camera: THREE.Camera) {
    // Рассчитываем расстояние между камерой и объектом
    const distance = camera.position.distanceTo(entityMesh.position);

    // Устанавливаем фиксированный размер рамки, независимо от дистанции
    const fixedSize = 10; // Размер рамки, который вы хотите видеть
    const scale =  distance / fixedSize;

    // Применяем масштаб к плоскости
    planeMesh.scale.set(scale, scale, scale);

    planeMesh.lookAt(camera.position)
}