<template>
  <pre>{{ data }}</pre>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/db/repos')
</script>

