import * as THREE from 'three';
import { useGLTF } from '@tresjs/cientos'
import { kdTree } from 'kd-tree-javascript'; // Импортируем библиотеку для k-d дерева

export class HeightmapGenerator {
    private width: number;
    private height: number;

    private modelSize: number = 0;
    private modelMinHeight: number = 0;
    private modelHeightRange: number = 0;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    // Функция для получения вершин из меша
    private getVertices(mesh: THREE.Mesh): THREE.Vector3[] {
        const vertices: THREE.Vector3[] = [];
        const geometry = mesh.geometry as THREE.BufferGeometry;
        const positionAttribute = geometry.getAttribute('position');

        if (positionAttribute) {
            for (let i = 0; i < positionAttribute.count; i++) {
                const vertex = new THREE.Vector3();
                vertex.fromBufferAttribute(positionAttribute, i);
                vertices.push(vertex);
            }
        }

        return vertices;
    }

    // Евклидова метрика для поиска ближайших вершин
    private distance(a: number[], b: number[]): number {
        return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
    }

    // Построение kd-дерева на основе вершин
    private buildKdTree(vertices: THREE.Vector3[]): any {
        const points = vertices.map(vertex => [
            Math.floor(((vertex.x) / this.modelSize) * (this.width - 1)),
            Math.floor(((vertex.y) / this.modelSize) * (this.height - 1)),
            vertex
        ]);

        return new kdTree(points, this.distance, ['0', '1']);
    }

    // Поиск ближайшей вершины для текущего пикселя (x, y)
    private findNearestVertex(x: number, y: number, kdTree: any): THREE.Vector3 {
        const nearest = kdTree.nearest([x, y], 1);
        return nearest[0][0][2]; // Возвращаем объект THREE.Vector3
    }

    // Генерация карты высот
    private generateHeightmapImage(vertices: THREE.Vector3[]): string | null {
        const canvas = document.createElement('canvas');
        canvas.width = this.width;
        canvas.height = this.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            console.error('Не удалось получить контекст canvas');
            return null;
        }

        const imageData = ctx.createImageData(this.width, this.height);
        const data = imageData.data;


        const kdTree = this.buildKdTree(vertices);

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                const nearestVertex = this.findNearestVertex(x, y, kdTree);

                const normalizedHeight = Math.floor(((nearestVertex.z - this.modelMinHeight) / this.modelHeightRange) * 255);
                const pixelIndex = (y * this.width + x) * 4;

                data[pixelIndex] = normalizedHeight;      // Red
                data[pixelIndex + 1] = normalizedHeight;  // Green
                data[pixelIndex + 2] = normalizedHeight;  // Blue
                data[pixelIndex + 3] = 255;               // Alpha (прозрачность)
            }
        }

        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL('image/png');
    }

    // Публичный метод для генерации карты высот
    public async generateHeightmapTerrain(modelUrl: string): Promise<string | null> {
        const gltf = await useGLTF(modelUrl)
        let heightmapDataUrl: string | null = null;

        gltf.scene.traverse((node: THREE.Object3D) => {
            if ((node as THREE.Mesh).isMesh) {
                const boundingBox = node.geometry.boundingBox;
                this.modelSize = boundingBox.max.x;
                this.modelMinHeight = boundingBox.min.z;
                this.modelHeightRange = boundingBox.max.z - boundingBox.min.z;
                const vertices = this.getVertices(node as THREE.Mesh);
                heightmapDataUrl = this.generateHeightmapImage(vertices);
            }
        });

        return heightmapDataUrl;
    }


}
