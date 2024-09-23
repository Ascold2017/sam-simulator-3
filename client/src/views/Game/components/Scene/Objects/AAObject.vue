<template>
    <TresMesh :position="aaObject.position">
        <TresConeGeometry :args="[3, 8, 5, 5]" />
        <TresMeshBasicMaterial :color="0x00ff00"/>
    </TresMesh>
</template>

<script setup lang="ts">
import { AAState } from '../../../../../models/sockets.model';

defineProps<{
    aaObject: AAState
}>()
</script>