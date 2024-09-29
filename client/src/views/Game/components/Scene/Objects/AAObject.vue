<template>
    <TresGroup :position="aaObject.position">
        <TresMesh :position="[0, -5, 0]">
            <TresConeGeometry :args="[3, 8, 32, 32]" />
            <TresMeshBasicMaterial :color="0x00ff00" />
        </TresMesh>
    </TresGroup>

</template>

<script setup lang="ts">
import { AAState } from '../../../../../models/sockets.model';

defineProps<{
    aaObject: AAState
}>()
</script>