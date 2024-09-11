<template>
    <TresMesh :position="[aaObject.position.x, aaObject.position.y, aaObject.position.z]">
        <TresConeGeometry :radius="3" :height="8" />
        <TresMeshStandardMaterial :color="0x00ff00"/>
    </TresMesh>
</template>

<script setup lang="ts">
import { AAObject } from '../../../../stores/game';

defineProps<{
    aaObject: AAObject
}>()
</script>