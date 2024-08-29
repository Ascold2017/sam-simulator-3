<template>
    <div class="main-screen" style="height: 100%;">

    </div>

</template>

<script setup lang="ts">
import { onUnmounted } from 'vue';
import { useSceneStore } from '../../stores/scene';
import { onMounted } from 'vue';

const scene = useSceneStore()

onMounted(() => {
    scene.initializeScene('.main-screen')
})

onUnmounted(() => {
    scene.$reset();
})
</script>