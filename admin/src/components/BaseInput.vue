<template>
    <div class="base-input px-2">
      <label v-if="label" :for="id" class="base-input__label mr-2">{{ label }}</label>
      <input :id="id" v-model="model" :type="type" :placeholder="placeholder" class="base-input__input" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits, computed } from 'vue';
  
  const props = defineProps<{ 
    modelValue: string | number | null;
    label?: string;
    id: string;
    placeholder?: string;
    type?: 'text' | 'number'
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
  .base-input__label {
    @apply text-white mb-1;
  }
  
  .base-input__input {
    @apply bg-gray-700 text-white border-gray-700 px-4 py-2 rounded w-full;
  }
  </style>
  