<template>
    <div class="mission-editor">
        
        <Scene class="mission-editor__scene"/>
        <Sidebar />
    </div>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar/index.vue';
import Scene from './components/Scene.vue';
import { onMounted, onUnmounted } from 'vue';

import { useRoute } from 'vue-router';
import { useMissionEditor } from '../../stores/missionEditor/index';

const route = useRoute();
const missionEditor = useMissionEditor()

onMounted(() => {
    route.params.id && missionEditor.getMission(route.params.id as string);
});

onUnmounted(() => {
    missionEditor.$reset();
})
</script>

<style scoped>
.mission-editor {
    @apply flex;
    height: calc(100vh - 72px);
}


.mission-editor__scene {
    @apply flex-1;
}
</style>