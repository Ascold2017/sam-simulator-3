<template>
    <TresCanvas window-size antialias alpha shadows preset="realistic">
        <Sky :elevation="sunElevation" />
        <!-- Освещение -->
        <TresAmbientLight :color="0x404040" :intensity="0.8" />
        <TresDirectionalLight :color="0xffffff" :intensity="1.2"
            :position="[0, Math.sin(sunElevationRad) * 100, Math.cos(sunElevationRad) * 100]" :look-at="[0, 0, 0]" />

        <TresPerspectiveCamera :position="[10, 500, 500]" :far="20000" />
        <CameraControls />

        <Suspense>
            <GLTFModel path="/models/mars/scene.gltf" cast-shadow receive-shadow/>
        </Suspense>
    </TresCanvas>
</template>

<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { CameraControls, Sky, GLTFModel } from '@tresjs/cientos'
const sunElevation = 3;
const sunElevationRad = sunElevation * (180 / Math.PI)

</script>