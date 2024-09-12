<template>
    <div class="base-input px-2">
      <label :for="id" class="base-input__label mr-2">{{ label }}</label>
      <input :id="id" v-model="model" :type="type" :placeholder="placeholder" class="base-input__input" />
    </div>
  </template>
  
  <script setup lang="ts">
  import { defineProps, defineEmits, computed } from 'vue';
  
  const props = defineProps({
    modelValue: String,
    label: String,
    id: String,
    placeholder: String,
    type: {
      type: String,
      default: 'text'
    }
  });
  
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
    @apply bg-gray-700 text-white px-4 py-2 rounded;
  }
  </style>
  