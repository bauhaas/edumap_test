<script setup lang="ts">
const query = defineModel<string>({ required: true })
</script>

<template>
  <div class="relative">
    <Icon name="lucide:search" class="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-icon-subtle-default" />
    <input
      v-model="query"
      type="search"
      aria-label="Rechercher une formation"
      placeholder="Rechercher une formation, une ville, un parcours…"
      class="h-14 w-full rounded-full border border-border-light-default bg-surface-light pr-14 pl-13 text-base shadow-xs transition outline-none focus:border-border-light-active focus:shadow-s [&::-webkit-search-cancel-button]:hidden"
    >
    <button
      v-if="query"
      type="button"
      aria-label="Effacer la recherche"
      class="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-icon-subtle-default transition hover:bg-actions-secondary"
      @click="query = ''"
    >
      <Icon name="lucide:x" class="size-4" />
    </button>
  </div>
</template>
