<template>
  <div>
    <NuxtRouteAnnouncer />
    <MainHeader />
    <div v-if="loading"
      class="fixed top-0 left-0 w-full h-full bg-white bg-opacity-75 z-50 flex items-center justify-center">
      <p>Loading</p>
    </div>
    <div class="container mx-auto">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
const loading = useState('loading', () => false)

</script>
