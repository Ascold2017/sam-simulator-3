<template>
    <TresCanvas clear-color="#82DBC5" window-size shadows alpha>
        <TresPerspectiveCamera :up="[0, 0, 1]" :args="[60, 1, 0.1, 10000]" :position="[0, 0, 10]"
            :look-at="[0, 0, 0]" />
        <OrbitControls />
        <HeightMap />

        <TresAmbientLight :intensity="1" />
        <TresDirectionalLight :position="[1, 1, 1]" :look-at="[0, 0, 0]" :intensity="0.5" />
    </TresCanvas>
</template>

<script setup lang="ts">
import HeightMap from './components/HeightMap.vue';
import OrbitControls from './components/OrbitControls.vue'
</script>