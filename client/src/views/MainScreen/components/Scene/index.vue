<template>
    <Suspense>
            <LoadIndicator />
        </Suspense>
    <TresCanvas window-size antialias alpha shadows preset="realistic">
        
        <Sky :azimuth="0" :elevation="sunElevation" :turbidity="10" :mie-coefficient="0.005" :mie-directional-g="0"
            :rayleigh="2" />


        <!-- Освещение -->
        <TresAmbientLight :color="0x404040" :intensity="0.8" />

        <!-- DirectionalLight с синхронизацией с углом солнца -->
        <TresDirectionalLight :color="0xffffff" :intensity="1.2"
            ::position="[0, Math.sin(sunElevationRad) * 100, Math.cos(sunElevationRad) * 100]" :look-at="[0, 0, 0]" />

        <!-- Камера -->
        <TresPerspectiveCamera v-if="currentAA" :fov="75" :far="10000"
            :position="[currentAA.position.x, currentAA.position.y, currentAA.position.z]"
            :look-at="[currentAA.position.x + 1, currentAA.position.y, currentAA.position.z]" :zoom="zoom" />
        <!-- Контролы-->
        <DeviceOrientationControl v-if="deviceStore.isMobile" :min-elevation="0" :max-elevation="Math.PI / 4"
            @update-direction="direction = $event" @update-orientation="deviceStore.orientation = $event" />
        <CustomFirstPersonControl v-else :min-elevation="0" :max-elevation="Math.PI / 4" :look-speed="0.06"
            @update-direction="direction = $event" />


        <Box :args="[10, 10]" :position="[-10, 0, 10]" castShadow receiveShadow>
            <TresMeshStandardMaterial color="red" />
        </Box>

        <!-- Летающие обьекты -->
        <FlightObject v-for="flightObject in parsedFlightObjects" :flight-object="flightObject"
            :key="flightObject.id" />
        <SmokeTrails />

        <!-- Зенитки-->
        <AAObject v-for="aaObject in aas" :aaObject="aaObject" />

        <!-- Террейн -->
        <Suspense v-if="map">
            <GLTFModel :path="mapPath" cast-shadow receive-shadow />
        </Suspense>
    </TresCanvas>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { TresCanvas } from '@tresjs/core'
import { Sky, Box, GLTFModel } from '@tresjs/cientos'
import { useGameStore } from '../../../../stores/game';
import { useDevice } from '../../../../stores/device';
import FlightObject from './FlightObject.vue';
import SmokeTrails from './SmokeTrails/SmokeTrails.vue'
import AAObject from './AAObject.vue';
import CustomFirstPersonControl from './CustomFirstPersonControl.vue';
import DeviceOrientationControl from './DeviceOrientationControl.vue';
import LoadIndicator from './LoadIndicator.vue'
import { computed } from 'vue';

const gameStore = useGameStore()
const deviceStore = useDevice()
const { currentAA, parsedFlightObjects, aas, map, direction } = storeToRefs(gameStore);


const sunElevation = 3;
const sunElevationRad = sunElevation * (Math.PI / 180);

const zoom = computed(() => deviceStore.orientation === 'portrait' ? 3 : 1)

const mapPath = computed(() => `/static/models/${map.value}/scene.gltf`)
</script>