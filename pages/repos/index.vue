<template>
  <button type="button" @click="fetchRepos" class="bg-white hover:bg-blue-100 text-blue-700 border-blue-700 border font-bold py-2 px-4 rounded">
    <i class="mdi mdi-git"></i>
    Fetch Repos
  </button>
  <UiFormInput v-model="filters.search" placeholder="Nombre" />
  <UiFormInput v-model="filters.project" placeholder="Proyecto" datalist="listProjects" />
  <datalist id="listProjects">
    <option v-for="project in projectList" :value="project" />
  </datalist>
  <UiFormInput v-model="filters.package" placeholder="package" />
  <UiTable
      :headers="[
        { label: 'Name', name: 'name' },
        { label: 'Project', name: 'project' },
        { label: 'Branch', name: 'defaultBranch' },
        { label: 'Size', name: 'size' },
        { label: 'Is Api', name: 'isApi' },
        { label: 'Is Exp', name: 'isExp' },
        { label: 'package.json', name: 'package' },
        { label: 'Actions', name: 'actions', classes: 'w-12'}
      ]"
      :data="repos ?? []"
      >
    <template #name="item">
      <strong class="block">{{ item.name }}</strong>
      <a :href="item.url" target="_blank" class="text-xs text-slate-500">
        {{ item.url }}
      </a>
    </template>
    <template #package="item">
      <UiModal v-if="item.package" label='ver'>
        <pre class="bg-gray-100 p-2 rounded-lg">{{ item.package }}</pre>
      </UiModal>
    </template>
    <template #actions="item">
      <button class="text-blue-700 hover:text-blue-900" @click="getPackageJson(item.id)">
        <i class="mdi mdi-code-block-braces"></i>
      </button>
    </template>
  </UiTable>
</template>
<script setup lang="ts">
const repos = ref([])
const filters = ref({
  search: '',
  project: '',
  package: '',
  isExp: true
})
const projectList = ref([])

const getRepos = async () => {
  const queryParam = Object.keys(filters.value)
    .map(key => `${key}=${filters.value[key]}`)
    .join('&')
  const data = await $fetch('/api/db/repos?' + queryParam)
  projectList.value = data.map((item: any) => item.project)
  projectList.value = [...new Set(projectList.value)]
  repos.value = data
}
getRepos()

const fetchRepos = async () => {
  repos.value = []
  const data = await $fetch('/api/devops/repos', { method: 'POST' })
  getRepos()
}

const getPackageJson = async (id: string) => {
  const data = await $fetch(`/api/devops/package`, { 
    method: 'POST',
    body: { id }
  })
  getRepos()
}

</script>