<template>
    <TresPoints ref="trailMesh">
        <TresBufferGeometry>
            <TresBufferAttribute :itemSize="3" />
        </TresBufferGeometry>
        <TresPointsMaterial :size="10" color="#CCC" :opacity="0.7" />
    </TresPoints>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { BufferAttribute } from 'three';
import { TresObject } from '@tresjs/core';

const props = defineProps<{
    positions: { x: number; y: number; z: number }[];
}>();

const trailMesh = ref<TresObject | null>(null);

// Следим за изменениями в позициях шлейфа
watchEffect(() => {
    if (props.positions.length > 0 && trailMesh.value) {
        // Создаем новый Float32Array с правильным размером
        const newArray = new Float32Array(props.positions.length * 3);

        // Заполняем массив новыми позициями
        props.positions.forEach((pos, index) => {
            newArray[index * 3] = pos.x;
            newArray[index * 3 + 1] = pos.y;
            newArray[index * 3 + 2] = pos.z;
        });

        // Устанавливаем новый BufferAttribute на геометрию через ref
        const attribute = new BufferAttribute(newArray, 3);
        trailMesh.value.geometry.setAttribute('position', attribute);

        // Уведомляем Three.js, что нужно обновить атрибут
        trailMesh.value.geometry.attributes.position.needsUpdate = true;
    }
});
</script>