import * as THREE from 'three'
import { MissionEnvironmentPayload } from '../../../../../shared/models/mission.model';

export function createAAObject(scene: THREE.Scene, aaObject: MissionEnvironmentPayload['aas'][number]) {
    let material: THREE.MeshStandardMaterial;

    switch (aaObject.type) {
        case 'active-missile':
            material = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
            break;
        case 'gun':
            material = new THREE.MeshStandardMaterial({ color: 0xffff00 });
            break;
        default:
            material = new THREE.MeshStandardMaterial({ color: 0xffffff });
            break;
    }
    // Применение позиции
    const mesh = new THREE.Mesh(new THREE.ConeGeometry(3, 8), material);
    mesh.position.set(
        aaObject.position.x,
        aaObject.position.y,
        aaObject.position.z,
    );
    mesh.name = aaObject.id;
    

    scene.add(mesh)
}
