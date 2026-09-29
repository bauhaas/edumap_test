<script setup lang="ts">
defineProps<{ icon: string, title: string, description: string, tone?: 'neutral' | 'error' }>()
</script>

<template>
  <div class="flex flex-col items-center rounded-md border border-dashed border-border-light-active bg-surface-light-60 px-6 py-16 text-center">
    <span
      class="flex size-14 items-center justify-center rounded-full"
      :class="tone === 'error' ? 'bg-error-surface text-error-subtle' : 'bg-surface-light-accented text-icon-subtle-default'"
    >
      <Icon :name="icon" class="size-6" />
    </span>
    <h2 class="mt-5 text-xl font-semibold">{{ title }}</h2>
    <p class="mt-2 max-w-sm text-sm text-tertiary">{{ description }}</p>
    <div v-if="$slots.default" class="mt-6">
      <slot />
    </div>
  </div>
</template>
