<template>
  <button type="button" @click="fetchRepos" class="bg-white hover:bg-blue-100 text-blue-700 border-blue-700 border font-bold py-2 px-4 rounded">
    <i class="mdi mdi-git"></i>
    Fetch Repos
  </button>
  <UiFormInput v-model="filters.search" placeholder="Nombre" />
  <UiFormSelect v-model="filters.projectId" :options="projectList" label="projectName" id="projectId" />
  <UiFormInput v-model="filters.package" placeholder="package" />
  <UiTable
      :headers="[
        { label: 'Name', name: 'name' },
        { label: 'Project', name: 'projectName' },
        { label: 'Branch', name: 'defaultBranch' },
        { label: 'Size', name: 'size' },
        { label: 'Is Api', name: 'isApi' },
        { label: 'Is Exp', name: 'isExp' },
        { label: 'package.json', name: 'package' },
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
    </template>
    <template #actions="item: any">
      <button class="text-blue-700 hover:text-blue-900" @click="getPackageJson(item.id)">
        <i class="mdi mdi-code-block-braces"></i>
      </button>
    </template>
  </UiTable>
</template>
<script setup lang="ts">
const repos = ref<any>([])
const filters = ref({
  search: '',
  projectId: '',
  package: '',
  isExp: 'true'
})
const projectList = ref<any>([])

const getProjects = async () => {
  const data = await $fetch('/api/db/repos/projects')
  projectList.value = data
}

const getRepos = async () => {
  const queryParam = new URLSearchParams(filters.value).toString()
  const data = await $fetch('/api/db/repos?' + queryParam)
  repos.value = data
}
getRepos()
getProjects()

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