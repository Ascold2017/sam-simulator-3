<template>
    <div class="map-editor">
        
        <Scene class="map-editor__scene"/>
        <Sidebar />
    </div>
</template>

<script setup lang="ts">
import Sidebar from './components/Sidebar.vue';
import Scene from './components/Scene.vue';
import { onMounted, onUnmounted } from 'vue';

import { useRoute } from 'vue-router';
import { useMaps } from '../../stores/maps';

const route = useRoute();
const mapsStore = useMaps()

onMounted(() => {
    route.params.id && mapsStore.getMapById(route.params.id as string);
});

onUnmounted(() => {
    mapsStore.$reset();
})
</script>

<style scoped>
.map-editor {
    @apply flex;
    height: calc(100vh - 72px);
}


.map-editor__scene {
    @apply flex-1;
}
</style>