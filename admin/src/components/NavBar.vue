<template>
    <nav class="navbar">
      <div class="navbar__title">AA Simulator</div>
      <ul class="navbar__nav">
        <li class="navbar__item"><RouterLink :to="{ name: 'missions'}" class="navbar__link">Missions</RouterLink></li>
        <li class="navbar__item"><a href="#" class="navbar__link">Targets</a></li>
        <li class="navbar__item"><a href="#" class="navbar__link">AAs</a></li>
        <li class="navbar__item"><a href="#" class="navbar__link">Users</a></li>
      </ul>
      <button @click="logout" class="navbar__logout">Logout</button>
    </nav>
  </template>
  
  <script setup lang="ts">
  const logout = () => {
    console.log('User logged out');
  }
  </script>
  
  <style scoped>
  .navbar {
    @apply bg-gray-800 p-4 flex justify-between items-center;
  }
  
  .navbar__title {
    @apply text-white text-xl font-bold;
  }
  
  .navbar__nav {
    @apply flex space-x-4;
  }
  
  .navbar__item {
    /* Необязательно что-то добавлять, если в будущем нужно будет добавить стили для каждого элемента */
  }
  
  .navbar__link {
    @apply text-white hover:text-gray-300;
  }
  
  .navbar__logout {
    @apply text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded;
  }
  </style>
  