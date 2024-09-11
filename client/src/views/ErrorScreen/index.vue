<template>
    <div class="error-screen">
        <h1 class="error-screen__title">Error Occured</h1>
        <p class="error-screen__message">{{ route.query.message }}</p>
    </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<style scoped>
.error-screen {
    @apply flex flex-col items-center justify-center h-screen;
}

.error-screen__title {
    @apply text-2xl font-bold;
}

.error-screen__message {
    @apply text-lg;
}
</style>