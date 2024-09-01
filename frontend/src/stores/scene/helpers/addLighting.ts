import * as THREE from 'three'
// Добавление освещения на сцену
export function addLighting(scene: THREE.Scene) {
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