<template>
    <TresCanvas window-size antialias alpha shadows preset="realistic">
        <Sky :elevation="sunElevation"/>

        <TresGridHelper />
        <TresAxesHelper />
        <!-- Освещение -->
        <TresAmbientLight :color="0x404040" :intensity="0.8" />
         <TresDirectionalLight :color="0xffffff" :intensity="1.2" :position="[0, Math.sin(sunElevationRad) * 100, Math.cos(sunElevationRad) * 100]" :look-at="[0,0,0]"/>

        <TresPerspectiveCamera :position="[10, 10, 10]" :far="10000" />
        <CustomFirstPersonControl :min-elevation="- Math.PI / 10" :max-elevation="Math.PI / 4" :look-speed="0.02"/>

        <Suspense>
            <Land />
        </Suspense>
    </TresCanvas>
</template>

<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { Sky } from '@tresjs/cientos'
import CustomFirstPersonControl from '../MainScreen/components/Scene/CustomFirstPersonControl.vue';
import Land from './Land.vue';

const sunElevation = 3;
const sunElevationRad = sunElevation * (180 / Math.PI)

</script>