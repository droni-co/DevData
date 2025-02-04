<template>
  <div class="p-2 border-b border-gray-200">
    <div class="flex">
      <h1 class="text-2xl font-bold grow">Logs</h1>
      <div class="flex">
        <UiFormSelect class="me-2" v-model="filters.report" :options="[
          { id: 'requestByMethod', name: 'Request by Method' },
          { id: 'errorsByType', name: 'Error by Type' },
          { id: 'errorsByResource' , name: 'Error by Resource' },
          { id: 'errorsByDescription', name: 'Error by Description' }
        ]" />
        <UiFormInput class="me-2" type="date" v-model="filters.fromDate" placeholder="package" />
        <UiFormInput class="me-2" type="date" v-model="filters.toDate" placeholder="package" />
        <button type="button" @click="fetchQuery" class="bg-white hover:bg-blue-100 text-blue-700 border-blue-700 border font-bold py-2 px-4 rounded">
          Generate
        </button>
      </div>
    </div>
  </div>
  <UiTable 
    :headers="tableData.headers"
    :data="tableData.data">
  </UiTable>
</template>
<script setup lang="ts">
  import { DateTime } from 'luxon';
  const records:Ref<any> = ref([]);
  const filters = ref({
    fromDate: DateTime.now().plus({ days: -1 }).toISODate(),
    toDate: DateTime.now().toISODate(),
    report: 'requestByMethod'
  });

  const tableData = ref({
    headers: [],
    data: []
  });
    
  const fetchQuery = async () => {
    const response = await $fetch('/api/analytics/query', {
      method: 'POST',
      body: filters.value
    });
    records.value = response
    if(records.value.tables[0]) {
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