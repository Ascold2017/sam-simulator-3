<template>
    <Suspense>
        <LoadIndicator />
    </Suspense>
    <TresCanvas window-size antialias alpha preset="realistic" shadows renderMode="on-demand">

        <Sky :azimuth="0" :elevation="sunElevation" />
        <TresFog :far="3000" :color="0x404040" />

        <!-- Освещение -->
        <TresAmbientLight :color="0x404040" :intensity="0.8"
            :position="[0, Math.sin(sunElevationRad) * 100, Math.cos(sunElevationRad) * 100]" />

        <!-- DirectionalLight с синхронизацией с углом солнца -->
        <TresDirectionalLight :color="0xffffff" :intensity="1.2"
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
    <CustomFirstPersonControl v-if="!isMobile" :min-elevation="0" :max-elevation="Math.PI / 4" />
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { TresCanvas } from '@tresjs/core'
import { Sky, GLTFModel } from '@tresjs/cientos'
import { useGameStore } from '../../../../stores/game';
import { useDevice } from '../../../../stores/device';
import TargetNPC from './Objects/TargetNPC.vue';
import Missile from './Objects/Missile.vue';
import AAObject from './Objects/AAObject.vue';
import CustomFirstPersonControl from './CustomFirstPersonControl.vue';
import LoadIndicator from './LoadIndicator.vue'
import SmokeEmitter from './SmokeEmitter.vue';
import Camera from './Camera.vue';
import { computed } from 'vue';

const gameStore = useGameStore()
const deviceStore = useDevice()
const { isMobile } = storeToRefs(deviceStore)
const { parsedTargetNPCs, missiles, aas, map } = storeToRefs(gameStore);

const sunElevation = 25;
const sunElevationRad = sunElevation * (Math.PI / 180);

const mapPath = computed(() => `${import.meta.env.VITE_APP_STATIC_URL}/models/${map.value}/scene.gltf`)
</script>