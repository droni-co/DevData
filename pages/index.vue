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
    <UiCard class="col-span-2 md:col-span-2">
      <h4 class="font-bold text-slate-700 text-xl">Repositorios por tipo</h4>
      <ClientOnly fallback-tag="span" fallback="Loading diagram...">
        <BarChart :chartData="reposByProjectChart" :options="{ indexAxis: 'y' }" />
      </ClientOnly>
    </UiCard>
  </div>
</template>

<script setup lang="ts">

import { DoughnutChart, BarChart } from 'vue-chart-3';

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

const reposByProject = await $fetch('/api/db/reports/repos-by-project')
const labels = reposByProject.map((repo) => repo.project);

const reposByProjectChart = {
  labels: reposByProject.map((repo) => repo.project),
  datasets: [
    {
      label: 'Repositorios por proyecto',
      data: reposByProject.map((repo) => repo.count),
      backgroundColor: ['#77CEFF', '#0079AF', '#003D4C', '#77C3FF', '#0070AF', '#00354C'],
    }
  ]
};


</script>
