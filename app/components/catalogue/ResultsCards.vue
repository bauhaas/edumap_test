<script setup lang="ts">
defineProps<{ results: ProgramResult[] }>()
</script>

<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <CatalogueProgramCard
      v-for="result in results"
      :key="result.group.generic.id"
      :result="result"
    />
  </div>
</template>
