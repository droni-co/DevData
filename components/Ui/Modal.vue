<template>
  <UiFormButton @click="modal = !modal">
    {{ props.label }}
  </UiFormButton>
  <div v-if="modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
    <div class="bg-white p-2">
      <div class="flex border-b">
        <h2 class="grow">{{ props.label }}</h2>
        <button @click="modal = !modal">
          <i class="mdi mdi-close"></i>
        </button>
      </div>
      <div class="max-h-[80vh] max-w-[80vw] overflow-auto p-4">
        <slot />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const modal = ref(false)
const props = defineProps({
  label: {
    type: String,
    required: true
  },
})
</script>