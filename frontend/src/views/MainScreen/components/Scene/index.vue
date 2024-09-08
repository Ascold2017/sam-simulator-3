<template>
    <TresCanvas window-size antialias alpha shadows preset="realistic">
        <Sky :elevation="sunElevation" :turbidity="10" :mie-coefficient="0.005" :mie-directional-g="0" :rayleigh="2" />
        <!-- Освещение -->
        <TresAmbientLight :color="0x404040" :intensity="0.8" />
        
        <!-- DirectionalLight с синхронизацией с углом солнца -->
        <TresDirectionalLight
            :color="0xffffff"
            :intensity="1.2"
            :position="[Math.sin(sunElevationRad) * 500, Math.cos(sunElevationRad) * 500, 0]"
            castShadow
            :shadow-mapSize="[2048, 2048]"
            :shadow-camera-left="-500"
            :shadow-camera-right="500"
            :shadow-camera-top="500"
            :shadow-camera-bottom="-500"
            :shadow-camera-near="0.5"
            :shadow-camera-far="2000"
            :shadow-radius="4"
            :shadow-bias="-0.0005"
        />
        <!-- Камера -->
        <TresPerspectiveCamera v-if="currentAA" :fov="75" :far="10000"
            :position="[currentAA.position.x, currentAA.position.y, currentAA.position.z]"
            :look-at="[currentAA.position.x + 1, currentAA.position.y, currentAA.position.z]" />
        
        <!-- Контролы-->
        <DeviceOrientationControl v-if="deviceStore.isMobile" :min-elevation="0" :max-elevation="Math.PI / 4"
            @update-direction="direction = $event" @update-orientation="deviceStore.orientation = $event" />
        <CustomFirstPersonControl v-else :min-elevation="0" :max-elevation="Math.PI / 4" :look-speed="0.06"
            @update-direction="direction = $event" />

        <Box :args="[10, 10]" :position="[0, 0, 0]" castShadow receiveShadow>
            <TresMeshStandardMaterial color="red"/>
        </Box>

        <!-- Летающие обьекты -->
        <FlightObject v-for="flightObject in parsedFlightObjects"
            :flight-object="flightObject"
            :prevState="prevFlightObjects.find(ps => ps.id === flightObject.id)"
            :key="flightObject.id"
        />
        <!-- Зенитки-->
        <AAObject v-for="aaObject in aas" :aaObject="aaObject"/>

        <!-- Террейн -->
        <Terrain :terrain-data="map" />
    </TresCanvas>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { TresCanvas } from '@tresjs/core'
import { Sky, Box } from '@tresjs/cientos'
import { ParsedFlightObject, useGameStore } from '../../../../stores/game';
import { useDevice } from '../../../../stores/device';
import Terrain from './Terrain.vue';
import FlightObject from './FlightObject.vue';
import AAObject from './AAObject.vue';
import CustomFirstPersonControl from './CustomFirstPersonControl.vue';
import DeviceOrientationControl from './DeviceOrientationControl.vue';

const gameStore = useGameStore()
const deviceStore = useDevice()
const { currentAA, parsedFlightObjects, aas, map, direction } = storeToRefs(gameStore);
const prevFlightObjects = ref<ParsedFlightObject[]>([])

const sunElevation = 45;
const sunElevationRad = sunElevation * (Math.PI/180)
watch(parsedFlightObjects, (_, prevState) => {
    prevFlightObjects.value = prevState;
})
</script>