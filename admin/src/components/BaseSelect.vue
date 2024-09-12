<template>
    <div class="base-select px-2">
        <label :for="id" class="base-select__label mr-2">{{ label }}</label>
        <select :id="id" v-model="model" class="base-select__select">
            <option v-for="option in options" :key="option.value" :value="option.value">
                {{ option.label }}
            </option>
        </select>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps<{
    modelValue: string | number | null;
    label: string;
    id: string;
    options: { value: string | number; label: string }[];
}>();

const emit = defineEmits(['update:modelValue']);

const model = computed({
    get() {
        return props.modelValue
    },
    set(v) {
        emit('update:modelValue', v)
    }
})
</script>

<style scoped>
.base-select__label {
    @apply text-white mb-1;
}

.base-select__select {
    @apply bg-gray-700 text-white px-4 py-2 rounded;
}
</style>