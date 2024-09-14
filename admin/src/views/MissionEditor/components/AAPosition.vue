<template>
    <Cone :args="[20, 40]"
        :position="[aaPosition.position.x, aaPosition.position.y, aaPosition.position.z]"
        :user-data="{ isAAPosition: true, aaPosition: aaPosition }"
        @click="emit('click', $event.object)">
        <TresMeshBasicMaterial color="red" />
    </Cone>
</template>

<script setup lang="ts">
import { Cone } from '@tresjs/cientos'
import { Object3D } from 'three';
import { EditableAAPosition } from '../../../stores/missionEditor/aaPositions';

defineProps<{ aaPosition: EditableAAPosition }>()

const emit = defineEmits<{ click: [object: Object3D] }>()
</script>