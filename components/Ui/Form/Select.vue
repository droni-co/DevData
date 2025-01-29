<template>
  <select
  @change="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    class="rounded-full bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
    <option v-for="option in options" :value="option[itemValue]" :selected="option[itemValue] === modelValue">
      {{ option[itemLabel] }}
    </option>
  </select>
</template>
<script setup lang="ts">
const props = defineProps({
  modelValue: {
    default: ''
  },
  options: {
    type: Array<{ [key: string]: any }>, // Add type annotation for the objects in the array
    default: []
  },
  itemValue: {
    type: String,
    default: 'id'
  },
  itemLabel: {
    type: String,
    default: 'name'
  }
})
</script>