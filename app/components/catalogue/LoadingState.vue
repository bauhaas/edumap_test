<script setup lang="ts">
defineProps<{ view: ViewMode }>()
</script>

<template>
  <div aria-busy="true" aria-label="Chargement des formations">
    <div v-if="view === 'cards'" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="n in 6" :key="n" class="animate-pulse rounded-md border border-border-light-default bg-surface-light p-5">
        <div class="h-5 w-16 rounded-full bg-surface-sunken" />
        <div class="mt-4 h-5 w-3/4 rounded-full bg-surface-sunken" />
        <div class="mt-5 h-3.5 w-1/2 rounded-full bg-surface-sunken" />
        <div class="mt-2 h-3.5 w-1/3 rounded-full bg-surface-sunken" />
        <div class="mt-6 h-8 w-28 rounded-full bg-surface-sunken" />
      </div>
    </div>
    <div v-else class="divide-y divide-border-light-default rounded-md border border-border-light-default bg-surface-light">
      <div v-for="n in 8" :key="n" class="grid animate-pulse grid-cols-[8rem_1.5fr_1fr_1fr_8rem_2rem] items-center gap-6 px-5 py-5">
        <div class="h-4 w-20 rounded-full bg-surface-sunken" />
        <div class="h-4 w-3/4 rounded-full bg-surface-sunken" />
        <div class="h-4 w-4/5 rounded-full bg-surface-sunken" />
        <div class="h-4 w-2/3 rounded-full bg-surface-sunken" />
        <div class="h-7 w-24 rounded-full bg-surface-sunken" />
        <div class="size-7 rounded-full bg-surface-sunken" />
      </div>
    </div>
  </div>
</template>
