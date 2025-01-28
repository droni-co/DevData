<template>
  <div class="relative overflow-x-auto">
    <table class="w-full text-sm text-left text-gray-500">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3" v-for="header in headers" :key="header.name" :class="header.classes">
            {{ header.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in data"
          class="bg-white border-b hover:bg-zinc-100">
          <td
            v-for="header in headers"
            class="px-6 py-4 text-gray-900">
            <slot :name="header.name" :count="1" v-bind="item">
              {{ (item as Record<string, any>)[header.name] }}
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
interface Header {
  label: string
  name: string
  classes?: string
}
const props = defineProps({
  headers: {
    type: Array<Header>,
    required: true
  },
  data: {
    type: Array<Object>,
    required: true
  }
})
</script>