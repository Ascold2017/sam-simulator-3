<template>
    <TresMesh :position="[aaObject.position.x, aaObject.position.y, aaObject.position.z]">
        <TresConeGeometry :args="[3, 8, 5, 5]" />
        <TresMeshBasicMaterial :color="0x00ff00"/>
    </TresMesh>
</template>

<script setup lang="ts">
import { AAObject } from '../../../../stores/game';

defineProps<{
    aaObject: AAObject
}>()
</script>