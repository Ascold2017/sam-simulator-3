<template>
    <TresGroup>
        <FlightObjectSmokeTrail v-for="smokeTrail in smokeTrails" :positions="smokeTrail.positions" />
    </TresGroup>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import FlightObjectSmokeTrail from './FlightObjectSmokeTrail.vue';
import { storeToRefs } from 'pinia';
import { useGameStore } from '../../../../../stores/game';

const gameStore = useGameStore()
const { parsedFlightObjects } = storeToRefs(gameStore);

const smokeTrails = ref<{ id: string; positions: { x: number; y: number; z: number }[] }[]>([]);
// Обновляем стейт шлейфов на основе parsedFlightObjects
watch(parsedFlightObjects, (newObjects) => {
    newObjects
        .filter(fo => fo.type === 'active-missile')
        .forEach((flightObject) => {
            const existingTrail = smokeTrails.value.find((trail) => trail.id === flightObject.id);
            if (existingTrail) {
                existingTrail.positions.unshift({
                    x: flightObject.position.x,
                    y: flightObject.position.y,
                    z: flightObject.position.z
                });
                // Ограничиваем длину шлейфа
                if (existingTrail.positions.length > 500) {
                    existingTrail.positions.pop();
                }
            } else {
                // Добавляем новый шлейф, если его еще нет
                smokeTrails.value.push({
                    id: flightObject.id,
                    positions: [{ x: flightObject.position.x, y: flightObject.position.y, z: flightObject.position.z }]
                });
            }
        });
});
</script>