<template>
    <div :class="['aa-info-card', { 'highlighted': isHighlighted }]">
        <h4>{{ aa.name }}</h4>
        <p><strong>Type:</strong> {{ aaType }}</p>
        <p><strong>Max kill range:</strong> {{ aa.ammoMaxRange }} m</p>
        <p><strong>Ammo speed:</strong> {{ aa.ammoVelocity }} m/s</p>
        <p><strong>View angle:</strong> {{ viewAngleDegrees.toFixed(2) }}°</p>
        <p><strong>Rate of fire:</strong> {{ fireRate.toFixed(2) }} shots per minute</p>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { AA } from '../../../../../shared/models/aa.model';

const props = defineProps<{ aa: AA; isHighlighted: boolean }>();

// Преобразуем угол обзора из радиан в градусы
const viewAngleDegrees = computed(() => props.aa.viewAngle * (180 / Math.PI));

// Преобразуем время перезарядки в скорострельность (выстрелы в минуту)
const fireRate = computed(() => 60 / props.aa.reloadTime);

// Тип зенитки
const aaType = computed(() => props.aa.type === 'active-missile' ? 'Surface-Air Missile system (SAM)' : 'Anti-aircraft gun system (AA)');
</script>

<style scoped>
.aa-info-card {
    @apply border border-gray-300 p-4 bg-gray-50 rounded-lg w-full;
}

.highlighted {
    @apply border-2 border-blue-500 bg-blue-50;
}
</style>