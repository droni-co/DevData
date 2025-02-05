<template>
  <UiCard>
    <div class="flex">
      <h3 class="text-lg font-bold grow">RSolicitudes por método</h3>
      <button type="button" @click="fetchQuery" class="bg-white hover:bg-blue-100 text-blue-700 border-blue-700 border font-bold py-1 px-3 rounded">
        <i class="mdi mdi-refresh"></i>
        sync
      </button>
    </div>
    <pre>
      {{ tableData }}
    </pre>
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
    const response = await $fetch('/api/analytics/query', {
      method: 'POST',
      body: props.filters
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