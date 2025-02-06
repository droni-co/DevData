<template>
  <UiCard>
    <div class="flex">
      <h3 class="text-lg font-bold grow">Errores de consola por descripción</h3>
      <button type="button" @click="fetchQuery" class="bg-white hover:bg-blue-100 text-blue-700 border-blue-700 border font-bold py-1 px-3 rounded">
        <i class="mdi mdi-refresh"></i>
        sync
      </button>
    </div>
    <div class="grid grid-cols-3 gap-2">
      <UiTable
        class="max-h-96 overflow-y-auto col-span-2"
        :headers="[
          { label: 'Error', name: '0' },
          { label: 'Ocurrencias', name: '1'}
        ]"
        :data="tableData.data">
        <template #0="item:any">
          <span @click="fetchResourcesByError(item[0])">{{ item[0] }}</span>
        </template>
      </UiTable>
      <UiTable
        class="max-h-96 overflow-y-auto"
        :headers="[
          { label: 'AppService', name: '0' },
          { label: 'Ocurrencias', name: '1'}
        ]"
        :data="resourcesTableData.data">
      </UiTable>
    </div>
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
const resourceRecords:Ref<any> = ref([]);
const tableData = ref({
  headers: [],
  data: []
});
const resourcesTableData = ref({
  headers: [],
  data: []
});


const fetchQuery = async () => {
  props.filters.report = 'errorsByDescription';
  const response = await $fetch('/api/analytics/query', {
    method: 'POST',
    body: props.filters
  });
  records.value = response
  if(records.value.tables[0]) {
    tableData.value.data = records.value.tables[0].rows
  }
};
const fetchResourcesByError = async (description:string) => {
  props.filters.report = 'resourceByError';
  props.filters.description = description.trim();
  const response = await $fetch('/api/analytics/query', {
    method: 'POST',
    body: props.filters
  });
  resourceRecords.value = response
  if(records.value.tables[0]) {
    resourcesTableData.value.data = resourceRecords.value.tables[0].rows
  }
};
</script>