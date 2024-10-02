<template>
    <TresCanvas window-size antialias alpha preset="realistic" shadows renderMode="on-demand">

        <Sky :distance="450000" :inclination="0.49" :azimuth="0.25" :turbidity="0.1" :rayleigh="2" :elevation="-20" />
        <TresFog :far="5000" :color="0x404040" />


        <!-- DirectionalLight с синхронизацией с углом солнца -->
        <TresDirectionalLight :color="0xffffff" :intensity="0.3"
            :position="[0, Math.sin(sunElevationRad) * 100, Math.cos(sunElevationRad) * 100]" :look-at="[0, 0, 0]"
            cast-shadow :shadow-mapSize-width="1024" :shadow-mapSize-height="1024" />

        <!-- Камера -->
        <Camera />
        <!-- Контролы-->

        <!-- Летающие обьекты -->
        <TargetNPC v-for="targetNPC in parsedTargetNPCs" :targetNPC="targetNPC" :key="targetNPC.id" />
        <Missile v-for="missile in missiles" :missile="missile" :key="missile.id" />
        <!-- Зенитки-->
        <AAObject v-for="aaObject in aas" :aaObject="aaObject" />

        <!-- Террейн -->
        <Suspense v-if="map">
            <GLTFModel :path="mapPath" receive-shadow />
        </Suspense>
    </TresCanvas>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { TresCanvas } from '@tresjs/core'
import { Sky, GLTFModel } from '@tresjs/cientos'
import { useGameStore } from '../../../../stores/game';
import TargetNPC from './Objects/TargetNPC.vue';
import Missile from './Objects/Missile.vue';
import AAObject from './Objects/AAObject.vue';
import Camera from './Camera.vue';
import { computed } from 'vue';

const gameStore = useGameStore()
const { parsedTargetNPCs, missiles, aas, map } = storeToRefs(gameStore);

const sunElevation = 25;
const sunElevationRad = sunElevation * (Math.PI / 180);

const mapPath = computed(() => `${import.meta.env.VITE_APP_STATIC_URL}/models/${map.value}/scene.gltf`)
</script>