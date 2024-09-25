<template>
    <div :class="['aa-info-card', { 'highlighted': isHighlighted }]">
        <h4>{{ aa.name }}</h4>
        <p><strong>Missiles count:</strong> {{ aa.missileCount }}</p>
        <p><strong>Min range:</strong> {{ aa.missileMinRange }} m</p>
        <p><strong>Max range:</strong> {{ aa.missileMaxRange }} m</p>
        <p><strong>Max kill radius:</strong> {{ aa.missileKillRadius }} m</p>
        <p><strong>Max oveload:</strong> {{ aa.missileMaxOverload }} G</p>
        <p><strong>Missile speed:</strong> {{ aa.missileVelocity }} m/s</p>
        <p><strong>Capture angle:</strong> {{ viewAngleDegrees.toFixed(2) }}°</p>
        <p><strong>Rate of fire:</strong> {{ fireRate.toFixed(2) }} shots per minute</p>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { AA } from '../../../models/aa.model';

const props = defineProps<{ aa: AA; isHighlighted: boolean }>();

// Преобразуем угол обзора из радиан в градусы
const viewAngleDegrees = computed(() => props.aa.captureAngle * (180 / Math.PI));

// Преобразуем время перезарядки в скорострельность (выстрелы в минуту)
const fireRate = computed(() => 60 / props.aa.reloadTime);

</script>

<style scoped>
.aa-info-card {
    @apply border border-gray-300 p-4 bg-gray-50 rounded-lg w-full;
}

.highlighted {
    @apply border-2 border-blue-500 bg-blue-50;
}
</style>