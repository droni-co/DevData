<template>
  <div class="flex py-2">
    <button type="button" @click="fetchRepos" class="bg-white hover:bg-blue-100 text-blue-700 border-blue-700 border font-bold py-2 px-4 rounded">
      Fetch
    </button>
    <h1 class="text-2xl font-bold grow py-2 px-2">Repositorios</h1>
    <div class="flex">
      <UiFormSelect v-model="filters.projectId" :options="projectList" itemLabel="projectName" itemValue="projectId" class="me-2" />
      <UiFormInput v-model="filters.packageJson" placeholder="packageJson" class="me-2" />
      <UiFormInput v-model="filters.pipeline" placeholder="pipeline" class="me-2" />
      <button type="button" @click="getRepos" class="bg-white hover:bg-blue-100 text-blue-700 border-blue-700 border font-bold py-2 px-4 rounded-full">
        <i class="mdi mdi-magnify"></i>
      </button>
    </div>
  </div>
  
  <UiTable
      :headers="[
        { label: 'Name', name: 'name' },
        { label: 'Project', name: 'projectName' },
        { label: 'Branch', name: 'defaultBranch' },
        { label: 'Size', name: 'size' },
        { label: 'Is Api', name: 'isApi' },
        { label: 'Is Exp', name: 'isExp' },
        { label: 'package', name: 'package' },
        { label: 'pipeline', name: 'pipeline' },
        { label: 'Actions', name: 'actions', classes: 'w-12'}
      ]"
      :data="repos ?? []"
      >
    <template #name="item: any">
      <strong class="block">{{ item.name }}</strong>
      <a :href="item.url" target="_blank" class="text-xs text-slate-500">
        {{ item.url }}
      </a>
    </template>
    <template #package="item: any">
      <UiModal v-if="item.package" label='ver'>
        <pre class="bg-gray-100 p-2 rounded-lg">{{ item.package }}</pre>
      </UiModal>
      <button v-else class="text-blue-700 hover:text-blue-900" @click="getPackageJson(item.id)">
        <i class="mdi mdi-download-box-outline text-2xl"></i>
      </button>
    </template>
    <template #pipeline="item: any">
      <UiModal v-if="item.pipeline" label='ver'>
        <pre class="bg-gray-100 p-2 rounded-lg block">{{ item.pipeline }}</pre>
      </UiModal>
      <button v-else class="text-blue-700 hover:text-blue-900" @click="getPipeline(item.id)">
        <i class="mdi mdi-download-box-outline text-2xl"></i>
      </button>
    </template>
  </UiTable>
</template>
<script setup lang="ts">
const loading = useState('loading', () => false)
const repos = ref<any>([])
const filters = ref({
  projectId: '',
  packageJson: '',
  pipeline: ''
})
const projectList = ref<any>([])

const getProjects = async () => {
  const data = await $fetch('/api/db/repos/projects')
  projectList.value = data
}

const getRepos = async () => {
  loading.value = true
  const queryParam = new URLSearchParams(filters.value).toString()
  const data = await $fetch('/api/db/repos?' + queryParam)
  repos.value = data
  loading.value = false
}
getRepos()
getProjects()

const fetchRepos = async () => {
  repos.value = []
  const data = await $fetch('/api/devops/repos', { method: 'POST' })
  getRepos()
}

const getPackageJson = async (id: string) => {
  await $fetch(`/api/devops/package`, { 
    method: 'POST',
    body: { id }
  })
  getRepos()
}
const getPipeline = async (id: string) => {
  await $fetch(`/api/devops/pipeline`, { 
    method: 'POST',
    body: { id }
  })
  getRepos()
}


</script>