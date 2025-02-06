<template>
  <UiCard>
    <div class="flex">
      <h3 class="text-lg font-bold grow">Solicitudes HTTP por endpoint</h3>
      <button type="button" @click="fetchQuery" class="bg-white hover:bg-blue-100 text-blue-700 border-blue-700 border font-bold py-1 px-3 rounded">
        <i class="mdi mdi-refresh"></i>
        sync
      </button>
    </div>
    <UiTable
      class="max-h-96 overflow-y-auto"
      :headers="[
        { label: 'Endpoint', name: '0' },
        { label: 'AppService', name: '1'},
        { label: 'Solicitudes', name: '2' }
      ]"
      :data="tableData.data">
    </UiTable>
  </UiCard>
</template>
<script setup lang="ts">
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


const fetchQuery = async () => {
  props.filters.report = 'requestByEndpoint';
  const response = await $fetch('/api/analytics/query', {
    method: 'POST',
    body: props.filters
  });
  records.value = response
  if(records.value.tables[0]) {
    tableData.value.data = records.value.tables[0].rows
  }
};
</script>