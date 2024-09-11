<template>
    <div class="users">
        <div class="users__header">
            <h1 class="users__title">Users</h1>
        </div>

        <table class="data-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Premium</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="aa in users" :key="aa.id">
                    <td>{{ aa.id }}</td>
                    <td>{{ aa.username }}</td>
                    <td>{{ aa.isPremium ? '+' : '-' }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useUsers } from '../../stores/users';

const userstore = useUsers();
const { users } = storeToRefs(userstore)

onMounted(() => {
    userstore.getUsers()
})
</script>

<style scoped>
.users {
    @apply p-4;
}

.users__header {
    @apply flex justify-between items-center mb-4;
}

.users__title {
    @apply text-2xl font-bold;
}
</style>