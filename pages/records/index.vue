<template>
  <h1>Records page</h1>
  <pre>{{ records }}</pre>
</template>
<script setup lang="ts">

const records = await $fetch('/api/analytics/query')
</script>