<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    class="bg-gray-50
      border
      border-gray-300
      text-gray-900
      focus:ring-blue-500
      focus:border-blue-500
      block
      w-full
      rounded-full"
    :placeholder="placeholder"
    :class="{'border-red-500': error.length > 0, 'p-1 text-sm': size === 's', 'p-2': size === 'm', 'p-5': size === 'l'}"
    :required="required"
    :pattern="pattern"
    :list="datalist">
</template>
<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  pattern: {
    type: String,
    default: '.*'
  },
  size: {
    type: String,
    default: 'm'
  },
  datalist: {
    type: String,
    default: ''
  }
})
</script>