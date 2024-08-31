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

  constructor(object: THREE.Object3D) {
    this.object = object;
    this.object.rotation.reorder("YXZ");

    this.enabled = true;

    this.deviceOrientation = {};
    this.screenOrientation = 0;

    this.alpha = 0;
    this.alphaOffsetAngle = 0;
    this.betaOffsetAngle = 0;
    this.gammaOffsetAngle = 0;
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

      quaternion.setFromEuler(euler); // orient the device

      quaternion.multiply(q1); // camera looks out the back of the device, not the top

      quaternion.multiply(q0.setFromAxisAngle(zee, -orient)); // adjust for screen orientation
    };
  })();

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

  public updateAlphaOffsetAngle(angle: number): void {
    this.alphaOffsetAngle = angle;
    this.update();
  }

  public updateBetaOffsetAngle(angle: number): void {
    this.betaOffsetAngle = angle;
    this.update();
  }

  public updateGammaOffsetAngle(angle: number): void {
    this.gammaOffsetAngle = angle;
    this.update();
  }

  public dispose(): void {
    this.disconnect();
  }
}
