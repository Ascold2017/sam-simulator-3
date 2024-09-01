import * as THREE from 'three';

export class DeviceOrientationControls {
  private object: THREE.Object3D;
  private enabled: boolean;
  private deviceOrientation: DeviceOrientationEvent | {};
  private screenOrientation: number;

  private alpha: number;
  private alphaOffsetAngle: number;
  private betaOffsetAngle: number;
  private gammaOffsetAngle: number;

  private minElevation: number;
  private maxElevation: number;

  constructor(
    object: THREE.Object3D,
    options?: { minElevation?: number; maxElevation?: number }
  ) {
    this.object = object;
    this.object.rotation.reorder("YXZ");

    this.enabled = true;

    this.deviceOrientation = {};
    this.screenOrientation = 0;

    this.alpha = 0;
    this.alphaOffsetAngle = 0;
    this.betaOffsetAngle = 0;
    this.gammaOffsetAngle = 0;

    // Инициализируем опции
    this.minElevation = options?.minElevation || 0;
    this.maxElevation = options?.maxElevation || Math.PI;

    this.connect();
  }

  private onDeviceOrientationChangeEvent = (event: DeviceOrientationEvent): void => {
    this.deviceOrientation = event;
  };

  private onScreenOrientationChangeEvent = (): void => {
    this.screenOrientation = window.orientation || 0;
  };

  private setObjectQuaternion = (() => {
    const zee = new THREE.Vector3(0, 0, 1);
    const euler = new THREE.Euler();
    const q0 = new THREE.Quaternion();
    const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5)); // - PI/2 around the x-axis

    return (quaternion: THREE.Quaternion, alpha: number, beta: number, gamma: number, orient: number): void => {
      euler.set(beta, alpha, -gamma, 'YXZ'); // 'ZXY' for the device, but 'YXZ' for us
      quaternion.setFromEuler(euler);

      quaternion.multiply(q1); // camera looks out the back of the device, not the top

      quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation

      // Применяем ограничения углов возвышения через кватернион
      this.applyElevationConstraints(quaternion);
    };
  })();

  private applyElevationConstraints(quaternion: THREE.Quaternion): void {
    // Извлекаем вектор направления "вперед"
    const forward = new THREE.Vector3(0, 0, -1);
    forward.applyQuaternion(quaternion);

    // Извлекаем текущий угол возвышения (угол между вектором вперед и плоскостью XZ)
    let elevation = Math.asin(forward.y);

    // Проверяем и ограничиваем угол возвышения
    if (elevation < this.minElevation || elevation > this.maxElevation) {
      const constrainedElevation = Math.max(this.minElevation, Math.min(this.maxElevation, elevation));

      // Применяем ограничение через вращение кватерниона
      const deltaElevation = constrainedElevation - elevation;
      const qElevation = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), deltaElevation);
      quaternion.multiply(qElevation);
    }
  }

  public connect(): void {
    this.onScreenOrientationChangeEvent(); // run once on load

    window.addEventListener('orientationchange', this.onScreenOrientationChangeEvent, false);
    window.addEventListener('deviceorientation', this.onDeviceOrientationChangeEvent, false);

    this.enabled = true;
  }

  public disconnect(): void {
    window.removeEventListener('orientationchange', this.onScreenOrientationChangeEvent, false);
    window.removeEventListener('deviceorientation', this.onDeviceOrientationChangeEvent, false);

    this.enabled = false;
  }

  public update(): void {
    if (this.enabled === false) return;

    const alpha = (this.deviceOrientation as DeviceOrientationEvent).alpha
      ? THREE.MathUtils.degToRad((this.deviceOrientation as DeviceOrientationEvent).alpha!) + this.alphaOffsetAngle
      : 0; // Z
    const beta = (this.deviceOrientation as DeviceOrientationEvent).beta
      ? THREE.MathUtils.degToRad((this.deviceOrientation as DeviceOrientationEvent).beta!) + this.betaOffsetAngle
      : 0; // X'
    const gamma = (this.deviceOrientation as DeviceOrientationEvent).gamma
      ? THREE.MathUtils.degToRad((this.deviceOrientation as DeviceOrientationEvent).gamma!) + this.gammaOffsetAngle
      : 0; // Y''
    const orient = this.screenOrientation ? THREE.MathUtils.degToRad(this.screenOrientation) : 0; // O

    this.setObjectQuaternion(this.object.quaternion, alpha, beta, gamma, orient);
    this.alpha = alpha;
  }

  public dispose(): void {
    this.disconnect();
  }
}
