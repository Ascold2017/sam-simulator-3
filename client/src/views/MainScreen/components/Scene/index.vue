<template>
    <Suspense>
            <LoadIndicator />
        </Suspense>
    <TresCanvas window-size antialias alpha preset="realistic">
        
        <Sky :azimuth="0" :elevation="sunElevation" :turbidity="10" :mie-coefficient="0.005" :mie-directional-g="0"
            :rayleigh="2" />


        <!-- The X axis is red. The Y axis is green. The Z axis is blue. -->
        <TresAxesHelper :args="[100]" :position="[0, 100, 0]" />
        <!-- Освещение -->
        <TresAmbientLight :color="0x404040" :intensity="0.8" />

        <!-- DirectionalLight с синхронизацией с углом солнца -->
        <TresDirectionalLight :color="0xffffff" :intensity="1.2"
            ::position="[0, Math.sin(sunElevationRad) * 100, Math.cos(sunElevationRad) * 100]" :look-at="[0, 0, 0]" />

        <!-- Камера -->
        <TresPerspectiveCamera v-if="currentAA" :fov="75" :far="10000"
            :position="[currentAA.position.x, currentAA.position.y, currentAA.position.z]"
            :look-at="[currentAA.position.x + 1, currentAA.position.y, currentAA.position.z]" />
        <!-- Контролы-->
        <DeviceOrientationControl v-if="deviceStore.isMobile" :min-elevation="0" :max-elevation="Math.PI / 4"
            @update-direction="direction = $event" @update-orientation="deviceStore.orientation = $event" />
        <CustomFirstPersonControl v-else :min-elevation="0" :max-elevation="Math.PI / 4" :look-speed="0.06"
            @update-direction="direction = $event" />


        

        <!-- Летающие обьекты -->
        <FlightObject v-for="flightObject in parsedFlightObjects" :flight-object="flightObject"
            :key="flightObject.id" />
        <SmokeEmitter :flight-objects="parsedFlightObjects"/>
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
import { Sky, GLTFModel } from '@tresjs/cientos'
import { useGameStore } from '../../../../stores/game';
import { useDevice } from '../../../../stores/device';
import FlightObject from './FlightObject.vue';
import AAObject from './AAObject.vue';
import CustomFirstPersonControl from './CustomFirstPersonControl.vue';
import DeviceOrientationControl from './DeviceOrientationControl.vue';
import LoadIndicator from './LoadIndicator.vue'
import SmokeEmitter from './SmokeEmitter.vue';
import { computed } from 'vue';

const gameStore = useGameStore()
const deviceStore = useDevice()
const { currentAA, parsedFlightObjects, aas, map, direction } = storeToRefs(gameStore);


const sunElevation = 1;
const sunElevationRad = sunElevation * (Math.PI / 180);


const mapPath = computed(() => `${import.meta.env.VITE_APP_STATIC_URL}/models/${map.value}/scene.gltf`)
</script>