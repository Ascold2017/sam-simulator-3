import * as THREE from 'three'
import { FlightObject } from '../../mission';

export function createFlightObject(scene: THREE.Scene, flightObject: FlightObject) {
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

    scene.add(mesh)

    addSmokeTrail(mesh, scene);
}

function addSmokeTrail(entityMesh: THREE.Mesh, scene: THREE.Scene) {
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
    scene.add(smokeTrail)
    entityMesh.userData = { smokeTrail }
}