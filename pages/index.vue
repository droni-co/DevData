<template>
  <ClientOnly fallback-tag="span" fallback="Loading diagram...">
    <DoughnutChart :chartData="testData" />
  </ClientOnly>
</template>

<script setup lang="ts">

import { DoughnutChart } from 'vue-chart-3';

const reposByType = await $fetch('/api/db/reports/repos-by-type')
const testData = {
  labels: ['Experiencia', 'Negocio'],
  datasets: [
    {
      data: [reposByType.exp, reposByType.nonExp],
      backgroundColor: ['#77CEFF', '#0079AF'],
    },
  ],
};


</script>
