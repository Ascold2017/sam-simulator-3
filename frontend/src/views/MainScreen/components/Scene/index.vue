<template>
    <TresCanvas window-size :clearColor="0x87CEEB" antialias alpha :powerPreference="'high-performance'">
        <!-- Сетка и оси -->
        <TresGridHelper :args="[1000]" />
        <TresAxesHelper :args="[100]" />

        <!-- Освещение -->
        <TresAmbientLight :color="0x404040" :intensity="1" />
        <TresDirectionalLight :color="0xffffff" :intensity="1" :position="[50, 500, 50]" :look-at="[0, 0, 0]" />

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
        <FlightObject v-for="flightObject in parsedFlightObjects" :flight-object="flightObject" />
        <!-- Зенитки-->
        <AAObject v-for="aaObject in aas" :aaObject="aaObject"/>

        <!-- Террейн -->
        <Terrain :terrain-data="map" />
    </TresCanvas>
</template>

<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { useGameStore } from '../../../../stores/game';
import Terrain from './Terrain.vue';
import { storeToRefs } from 'pinia';
import FlightObject from './FlightObject.vue';
import AAObject from './AAObject.vue';
import CustomFirstPersonControl from './CustomFirstPersonControl.vue';
import { useDevice } from '../../../../stores/device';
import DeviceOrientationControl from './DeviceOrientationControl.vue';

const gameStore = useGameStore()
const deviceStore = useDevice()
const { currentAA, parsedFlightObjects, aas, map, direction } = storeToRefs(gameStore)
</script>