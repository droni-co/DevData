<template>
  <UiCard>
    <div class="flex">
      <h3 class="text-lg font-bold grow">Solicitudes HTTP por método</h3>
      <button type="button" @click="activeTab = 'table'" class="bg-white hover:bg-slate-100 text-slate-700 border-slate-700 border py-1 px-3 rounded-l">
        <i class="mdi mdi-table"></i>
        Tabla
      </button>
      <button type="button" @click="activeTab = 'chart'" class="bg-white hover:bg-slate-100 text-slate-700 border-slate-700 border py-1 px-3 rounded-r  me-2">
        <i class="mdi mdi-chart-doughnut"></i>
        Gráfico
      </button>
      <button type="button" @click="fetchQuery" class="bg-white hover:bg-blue-100 text-blue-700 border-blue-700 border font-bold py-1 px-3 rounded">
        <i class="mdi mdi-refresh"></i>
        sync
      </button>
    </div>
    <DoughnutChart v-if="activeTab === 'chart' && chartData.length > 0" ref="doughnutRef" :chartData="dataSet" />
    <UiTable v-if="activeTab === 'table'"
      :headers="tableData.headers"
      :data="tableData.data">
    </UiTable>
  </UiCard>
</template>
<script setup lang="ts">
import { DoughnutChart } from 'vue-chart-3';
const activeTab = ref('chart');
const props = defineProps({
  filters: {
    type: Object as PropType<any>,
    required: true
  }
})

const records:Ref<any> = ref([]);
const tableData = ref({
  headers: [],
  data: []
});
const doughnutRef = ref();

const chartData = ref([])
const chartLabels = ref([])

const dataSet = computed(() => ({
  labels: chartLabels.value,
  datasets: [
    {
      data: chartData.value,
      backgroundColor: ['#77CEFF', '#0079AF', '#123E6B', '#97B0C4', '#A5C8ED'],
    },
  ],
}));

const fetchQuery = async () => {
  props.filters.report = 'requestByMethod';
  const response = await $fetch('/api/analytics/query', {
    method: 'POST',
    body: props.filters
  });
  records.value = response
  if(records.value.tables[0]) {
    chartLabels.value = records.value.tables[0].rows.map((row: any) => row[0]);
    chartData.value = records.value.tables[0].rows.map((row: any) => row[1]);
    tableData.value.headers = records.value.tables[0].columns.map((header: any, index:number) => {
      return {
        label: header.name,
        name: index
      }
    });
    tableData.value.data = records.value.tables[0].rows
  }
};
</script>