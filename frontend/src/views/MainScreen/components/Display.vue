<template>
    <v-stage ref="stage" :config="stageConfig">
                <v-layer>
                    <v-regular-polygon v-for="(radar, index) in parsedRadars" :key="index" :x="radar.x" :y="radar.y"
                        :sides="3" :radius="5" fill="green" />
                </v-layer>
            </v-stage>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RadarResponse } from '../../../../../shared/models/mission.model';

const props = defineProps<{
    radars: RadarResponse[]
}>()
const stageConfig = ref({
    width: 0,
    height: 0,
});

const parsedRadars = computed(() => {
    return props.radars.map((radar) => {
        return {
            x: radar.position.x / 1000 + stageConfig.value.width / 2,
            y: radar.position.y / 1000 + stageConfig.value.height / 2,
        };
    });
});

const updateStageSize = () => {
    const size = Math.min(window.innerWidth, 1000);
    stageConfig.value.width = size;
    stageConfig.value.height = size;
};

onMounted(() => {
    updateStageSize();
    window.addEventListener('resize', updateStageSize);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateStageSize);
});

</script>