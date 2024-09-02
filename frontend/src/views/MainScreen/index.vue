<template>

    <TopBar />
    <div class="main-screen" style="height: 100%;"></div>

    <AimGUI />
    <ActionBar />
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useSceneStore } from '../../stores/scene/scene';

import TopBar from './components/TopBar.vue';
import AimGUI from './components/AimGUI.vue'
import ActionBar from './components/ActionBar.vue';

const scene = useSceneStore()

onMounted(() => {
    scene.initializeScene('.main-screen')
})

onUnmounted(() => {
    scene.$reset();
})
</script>