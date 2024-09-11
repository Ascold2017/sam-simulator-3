<template>
  <div class="app">
    <NavBar />
    <main class="app__content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import NavBar from './components/NavBar.vue';
</script>

<style scoped>
.app {
  @apply h-screen flex flex-col;
}

.app__content {
  @apply flex-1 bg-gray-100 p-4;
}
</style>
