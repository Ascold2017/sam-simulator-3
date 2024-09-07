<template>
    <TresMesh :rotation="[-Math.PI / 2, 0, 0]" v-if="terrainGeometry">
        <primitive :object="terrainGeometry" />
        <TresMeshStandardMaterial :color="0x0000ff" :side="1" />
    </TresMesh>
</template>

<script setup lang="ts">
import { PlaneGeometry } from 'three';
import { watch } from 'vue';
import { onMounted } from 'vue';
import { ref } from 'vue';

const props = defineProps<{ terrainData: { size: number, data: number[][] } }>()
const terrainGeometry = ref<PlaneGeometry | null>(null)

onMounted(() => {
    createHeightmapTerrain()
})

watch(() => props.terrainData, () => {
    createHeightmapTerrain();
})
function createHeightmapTerrain() {
    console.log(props.terrainData)
    const { size, data } = props.terrainData;

    // Создаем плоскость с сеткой по количеству точек в данных высот
    const width = (data.length - 1) * size;
    const height = (data[0].length - 1) * size;
    const geometry = new PlaneGeometry(width, height, data.length - 1, data[0].length - 1);

    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
            const vertexIndex = i * data[i].length + j;
            const heightValue = data[i][j];

            // Устанавливаем высоту (Z) для каждой вершины
            geometry.attributes.position.setZ(vertexIndex, heightValue);
            // Устанавливаем позиции X и Y с учетом elementSize
            const x = (j - (data[i].length - 1) / 2) * size;
            const y = (i - (data.length - 1) / 2) * size;
            geometry.attributes.position.setX(vertexIndex, x);
            geometry.attributes.position.setY(vertexIndex, y);
        }
    }
    geometry.computeVertexNormals();

    terrainGeometry.value = geometry;
};
</script>