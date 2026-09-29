<script setup lang="ts">
const sort = defineModel<SortState>({ required: true })
const selectId = useId()

function toggleDirection() {
  sort.value = { ...sort.value, direction: sort.value.direction === 'asc' ? 'desc' : 'asc' }
}
</script>

<template>
  <div class="inline-flex items-center gap-1 rounded-full bg-actions-secondary p-1">
    <label :for="selectId" class="sr-only">Trier par</label>
    <div class="relative">
      <Icon name="lucide:arrow-up-down" class="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-icon-subtle-default" />
      <select
        :id="selectId"
        :value="sort.key"
        class="h-8 cursor-pointer appearance-none rounded-full bg-surface-light pr-8 pl-9 text-sm font-medium text-primary shadow-xs outline-none focus-visible:outline-2 focus-visible:outline-actions-primary"
        @change="sort = { ...sort, key: ($event.target as HTMLSelectElement).value as SortKey }"
      >
        <option v-for="key in SORT_KEYS" :key="key" :value="key">{{ SORT_LABELS[key] }}</option>
      </select>
      <Icon name="lucide:chevron-down" class="pointer-events-none absolute top-1/2 right-3 size-3.5 -translate-y-1/2 text-icon-subtle-default" />
    </div>
    <button
      type="button"
      :aria-label="`Ordre ${SORT_DIRECTIONS[sort.direction].label.toLowerCase()}`"
      :title="SORT_DIRECTIONS[sort.direction].label"
      class="flex size-8 items-center justify-center rounded-full text-secondary transition hover:bg-surface-light hover:text-primary"
      @click="toggleDirection"
    >
      <Icon :name="SORT_DIRECTIONS[sort.direction].icon" class="size-4" />
    </button>
  </div>
</template>
