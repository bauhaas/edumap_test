<script setup lang="ts">
defineProps<{ filters: FilterState, favoritesCount: number, hasActiveCriteria: boolean }>()
const favoritesOnly = defineModel<boolean>('favoritesOnly', { required: true })
const emit = defineEmits<{ open: [key: FilterKey], reset: [] }>()
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <CatalogueFilterChip
      v-for="key in FILTER_KEYS"
      :key="key"
      :label="FILTER_DEFINITIONS[key].label"
      :icon="FILTER_DEFINITIONS[key].icon"
      :active="filters[key].length > 0"
      :count="filters[key].length"
      chevron
      @click="emit('open', key)"
    />
    <CatalogueFilterChip
      label="Favoris"
      :icon="FAVORITE_ICONS.inactive"
      :active="favoritesOnly"
      :count="favoritesCount"
      @click="favoritesOnly = !favoritesOnly"
    />
    <button
      v-if="hasActiveCriteria"
      type="button"
      class="ml-1 text-sm font-medium text-tertiary underline-offset-4 transition hover:text-primary hover:underline"
      @click="emit('reset')"
    >
      Tout réinitialiser
    </button>
  </div>
</template>
