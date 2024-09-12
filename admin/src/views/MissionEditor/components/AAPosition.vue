<template>
    <Cone :args="[10, 20]"
        :position="[aaPosition.position.x, aaPosition.position.y, aaPosition.position.z]"
        :user-data="{ isAAPosition: true, aaPosition: aaPosition }"
        @click="emit('click', $event.object)">
        <TresMeshStandardMaterial color="red" />
    </Cone>
</template>

<script setup lang="ts">
import { Cone } from '@tresjs/cientos'
import { Object3D } from 'three';
import { EditableAAPosition } from '../../../stores/missionEditor';

const props = defineProps<{ aaPosition: EditableAAPosition }>()

const emit = defineEmits<{ click: [object: Object3D] }>()
</script>