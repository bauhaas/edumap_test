<script setup lang="ts">
const view = defineModel<ViewMode>({ required: true })
const modes = Object.keys(VIEW_MODES) as ViewMode[]
</script>

<template>
  <div role="radiogroup" aria-label="Affichage" class="inline-flex rounded-full bg-actions-secondary p-1">
    <button
      v-for="mode in modes"
      :key="mode"
      type="button"
      role="radio"
      :aria-checked="view === mode"
      :aria-label="VIEW_MODES[mode].label"
      class="flex h-8 items-center gap-1.5 rounded-full px-3 text-sm font-medium transition duration-200 ease-in-quad"
      :class="view === mode ? 'bg-surface-light text-primary shadow-xs' : 'text-tertiary hover:text-primary'"
      @click="view = mode"
    >
      <Icon :name="VIEW_MODES[mode].icon" class="size-4" />
      <span class="hidden sm:inline">{{ VIEW_MODES[mode].label }}</span>
    </button>
  </div>
</template>
