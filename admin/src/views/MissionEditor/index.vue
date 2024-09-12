<template>
    <div class="mission-editor">
        <Toolbar class="mb-3"/>
        <Scene class="mission-editor__scene"/>
    </div>
</template>

<script setup lang="ts">
import Toolbar from './components/Toolbar.vue';
import Scene from './components/Scene.vue';
import { onMounted, onUnmounted } from 'vue';

import { useRoute } from 'vue-router';
import { useMissionEditor } from '../../stores/missionEditor';

const route = useRoute();
const missionEditor = useMissionEditor()

onMounted(() => {
    console.log(route.params.id)
    route.params.id && missionEditor.getMission(route.params.id as string);
});

onUnmounted(() => {
    missionEditor.$reset();
})
</script>

<style scoped>
.mission-editor {
    @apply flex flex-col;
    height: calc(100vh - 110px);
}


.mission-editor__scene {
    @apply flex-1;
}
</style>