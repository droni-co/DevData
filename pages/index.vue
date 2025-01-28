<template>
  <pre>{{ data }}</pre>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/devops/repos', { method: 'POST' })
</script>

