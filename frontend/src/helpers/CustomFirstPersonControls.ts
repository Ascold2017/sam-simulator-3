import * as THREE from 'three';

export class CustomFirstPersonControls {
    private camera: THREE.PerspectiveCamera;
    private lookSpeed: number;
    private minElevation: number;
    private maxElevation: number;

    private currentAzimuth = 0;
    private currentElevation = 0;

    private rotationSpeedX = 0;
    private rotationSpeedY = 0;

    constructor(
        camera: THREE.PerspectiveCamera,
        options?: { lookSpeed?: number, minElevation?: number; maxElevation?: number }
    ) {
        this.camera = camera;
        this.lookSpeed = options?.lookSpeed || 0.2;
        this.minElevation = options?.minElevation || 0;
        this.maxElevation = options?.maxElevation || Math.PI;

        this.initEventListeners();
    }

    private initEventListeners(): void {
        document.body.addEventListener('mousemove', this.onMouseMove.bind(this));
    }

    private onMouseMove(event: MouseEvent): void {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        const distanceX = event.clientX - centerX;
        const distanceY = event.clientY - centerY;

        // Нормализуем расстояние от центра и умножаем на lookSpeed для увеличения скорости вращения
        this.rotationSpeedX = (distanceX / centerX) * this.lookSpeed * 0.05;
        this.rotationSpeedY = (distanceY / centerY) * this.lookSpeed * 0.05;
    }

    private normalizeAngle(angle: number): number {
        return angle < 0 ? angle + 2 * Math.PI : angle;
    }

    private updateCameraRotation(): void {
        // Обновляем азимут и угол возвышения на основе сохраненной скорости
        this.currentAzimuth -= this.rotationSpeedX;
        this.currentAzimuth = this.normalizeAngle(this.currentAzimuth);

        this.currentElevation -= this.rotationSpeedY;
        this.currentElevation = Math.max(this.minElevation, Math.min(this.maxElevation, this.currentElevation));

        this.camera.rotation.set(this.currentElevation, this.currentAzimuth, 0, 'YXZ');
    }

    public update(): void {
        this.updateCameraRotation();
    }

    public dispose(): void {
        document.body.removeEventListener('mousemove', this.onMouseMove.bind(this));
    }
}
