import * as THREE from 'three'
import { FlightObjectsUpdateResponse } from '../../../../../shared/models/mission.model';

export function updateFlightObject(entityMesh: THREE.Mesh, update: FlightObjectsUpdateResponse[number]) {
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