<template>
  <ClientOnly fallback-tag="span" fallback="Loading diagram...">
    <Bar id="my-chart-id" :options="cData.chartOptions" :data="cData.chartData" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const cData = {
  chartData: {
    labels: ['January', 'February', 'March'],
    datasets: [{ data: [40, 20, 12] }]
  },
  chartOptions: {
    responsive: true
  }
}
</script>
