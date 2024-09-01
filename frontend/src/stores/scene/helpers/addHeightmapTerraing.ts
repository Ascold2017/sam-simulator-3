import * as THREE from 'three'


export function addHeightmapTerrain(scene: THREE.Scene, terrain: any) {

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


    scene.add(mesh);
}
