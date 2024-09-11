<template>
    <img :src="heightmapImageURL" v-if="heightmapImageURL" alt="Heightmap Preview" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';
import { HeightmapGenerator } from '../../assets/heightmapGenerator';

const heightmapImageURL = ref<string | null>(null)


onMounted(async () => {
    const generator = new HeightmapGenerator(1024, 1024)
    heightmapImageURL.value = await generator.generateHeightmapTerrain('/models/mars/scene.gltf')
})
</script>