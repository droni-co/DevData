<template>
  <div class="container mx-auto grid grid-cols-2 gap-4 md:grid-cols-3 my-4">
    <UiCard>
      <h4 class="font-bold text-slate-700 text-xl">Repositorios por tipo</h4>
      <ClientOnly fallback-tag="span" fallback="Loading diagram...">
        <DoughnutChart :chartData="reposByTypeChart" />
      </ClientOnly>
      <ul>
        <li class="text-slate-800 flex justify-between">
          Experiencia: <span>{{ reposByType.exp }}</span>
        </li>
        <li class="text-slate-800 flex justify-between">
          Negocio: <span>{{ reposByType.api - reposByType.exp }}</span>
        </li>
        <li class="text-slate-800 flex justify-between">
          Otros: <span>{{ reposByType.others }}</span>
        </li>
      </ul>
    </UiCard>
  </div>
</template>

<script setup lang="ts">

import { DoughnutChart } from 'vue-chart-3';

const reposByType = await $fetch('/api/db/reports/repos-by-type')
const reposByTypeChart = {
  labels: ['Experiencia', 'Negocio', 'Otros'],
  datasets: [
    {
      data: [reposByType.exp, (reposByType.api - reposByType.exp), reposByType.others],
      backgroundColor: ['#77CEFF', '#0079AF', '#003D4C'],
    },
  ],
};


</script>
