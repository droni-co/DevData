<template>
  <button type="button" @click="fetchRepos" class="bg-white hover:bg-blue-100 text-blue-700 border-blue-700 border font-bold py-2 px-4 rounded">
    <i class="mdi mdi-git"></i>
    Fetch Repos
  </button>
  <UiTable
      :headers="[
        { label: 'Name', name: 'name' },
        { label: 'Project', name: 'project' },
        { label: 'Branch', name: 'defaultBranch' },
        { label: 'Size', name: 'size' },
        { label: 'Is Api', name: 'isApi' },
        { label: 'Is Exp', name: 'isExp' },
        { label: '', name: 'actions', classes: 'w-12'}
      ]"
      :data="repos ?? []"
      >
  </UiTable>
</template>
<script setup lang="ts">
const repos = ref([])

const getRepos = async () => {
  const data = await $fetch('/api/db/repos')
  repos.value = data
}
getRepos()

const fetchRepos = async () => {
  repos.value = []
  const data = await $fetch('/api/devops/repos', { method: 'POST' })
  getRepos()
}

</script>