<template>
    <TresMesh :position="[flightObject.position.x, flightObject.position.y, flightObject.position.z]">
        <TresSphereGeometry :radius="2"/>
        <TresMeshStandardMaterial :color="0xff0000"/>
    </TresMesh>
</template>

<script setup lang="ts">
import { ParsedFlightObject } from '../../../../stores/game';

defineProps<{
    flightObject: ParsedFlightObject
}>()
</script>